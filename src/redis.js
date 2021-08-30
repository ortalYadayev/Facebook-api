import redis from "redis";

const redisConf = {
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  no_ready_check: true,
};

console.log(redisConf);

const client = redis.createClient(redisConf);

client.on("error", function(error) {
  console.error("Error from redis: " + error);
});

client.on("connect", () => {
  console.error("redis is connecting");
});

