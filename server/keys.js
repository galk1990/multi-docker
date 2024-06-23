const { getSecretKey } = require("./providers/aws/secret-manager");

const devKeys = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,

  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT,
};

const getKeys = async () => {
  switch (process.env.ENV) {
    case "dev":
      return devKeys;
    default:
      const keys = await getSecretKey("multiDocker/keys", "us-east-1");
      console.log("keys = ", keys);
      return JSON.parse(keys);
  }
};

module.exports = {
  getKeys,
};
