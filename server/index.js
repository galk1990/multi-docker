const { Pool } = require("pg");
const { getKeys } = require("./keys");
const TAG = "server/index.js";

// Express app setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); //what is cors? it is a package that allows for cross-origin requests
//what are cross-origin requests? they are requests that are made from one domain to another domain

const app = express();
app.use(cors());
app.use(bodyParser.json());

const initApp = async () => {
  const keys = await getKeys();

  const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl:
      process.env.NODE_ENV !== "production"
        ? false
        : { rejectUnauthorized: false },
  });

  pgClient.on("connect", (client) => {
    const createValuesTable = () =>
      client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.log(TAG, "createValuesTable", err));
    createValuesTable();
  });

  //Redis client setup
  const redis = require("redis");
  const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
  });

  const redisPublisher = redisClient.duplicate();

  // Express route handlers
  app.get("/", (req, res) => {
    res.send("Hi");
  });

  app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * from values");
    res.send(values.rows);
  });

  app.get("/values/current", async (req, res) => {
    redisClient.hgetall("values", (err, values) => {
      res.send(values);
    });
  });

  app.post("/values", async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) {
      return res.status(422).send("Index too high");
    }
    redisClient.hset("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
    res.send({ working: true });
  });

  app.listen(5000, (err) => {
    console.log(TAG, "Listening in server on port 5000");
  });
};

initApp();
// Postgres Client Setup
