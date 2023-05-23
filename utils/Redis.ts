import {createClient} from 'redis';
class Redis {
  client;
  constructor(url: string) {
    this.client = createClient({
      url,
    })
    this.client.on("error", (err) => {
      console.error(err);
    });
    this.client.on("connect", () => {
      console.log("Redis connected successfully");
    });
    this.client.connect();
  }
}

const redisClient = new Redis("redis://redis:6379");
export default redisClient;