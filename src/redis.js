import redis from "redis";

const redisConf = {
  auth_pass: process.env.REDIS_PASS,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  no_ready_check: true,
};

const client = redis.createClient(redisConf);

client.on("error", function(error) {
  console.error("Error from redis: " + error);
});

client.on("connect", () => {
  console.error("redis is connecting");
});

client.set("Channel", "CodeSpace", redis.print);
client.get("Channel", redis.print);
