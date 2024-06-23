const redis = require("redis");
const keys = require("./keys");

async function initWorker() {
  //create a redis client
  const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
  });

  const sub = redisClient.duplicate();
  //what is duplicate? it is a function that creates a new client that will be used for subscibing to channels

  function fibonacci(index) {
    if (index < 2) return 1;
    return fibonacci(index - 1) + fibonacci(index - 2);
  }

  sub.on("message", (channel, indexMsg) => {
    //what is hsset? it is a function that sets a value in a hash
    redisClient.hset("values", indexMsg, fibonacci(parseInt(indexMsg)));
  });

  //what is subscribe(insert)? it is a function that subscribes to the insert channel
  sub.subscribe("insert"); //subscribe to any insert event (of data in redis)
}

initWorker();
