import redis from 'redis';

const redisClient = redis.createClient({
  url: 'redis://redis:6379',
})

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.log('Something went wrong ' + err);
});

export default redisClient;