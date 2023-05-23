import {createClient} from 'redis';
class RedisClient {
  redisClient;
  constructor() {
    this.redisClient = createClient({
      url: 'redis://redis:6379',
    })
    this.redisClient.on("error", (err) => {
      console.error(err);
    });
    this.redisClient.on("connect", () => {
      console.log("Redis connected successfully");
    });
    this.redisClient.connect();
  }
}

const redisClient = new RedisClient();
export default redisClient;