const { getSecretKey } = require("./providers/aws/secret-manager");

const devKeys = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};

const getKeys = async () => {
  switch (process.env.ENV) {
    case "dev":
      return devKeys;
    default:
      const keys = await getSecretKey("multiDocker/keys", "us-east-1");
      return JSON.parse(keys);
  }
};

module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};
