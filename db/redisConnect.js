import { Redis } from 'ioredis';
import logger from '../commom/logger.js';

let redisClient = null;

export function initRedis() {
    return new Promise((resolve, reject) => {
        redisClient = new Redis({
            port: 6379,
            host: "127.0.0.1",
            db: 0,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        redisClient.on('connect', () => {
            logger.info('Redis connected');
            resolve(redisClient);
        });

        redisClient.on('error', (err) => {
            logger.error('Redis connection failed:', err);
            reject(err);
        });
    });
}

export function getRedisClient() {
    return redisClient;
}

export default { initRedis, getRedisClient };
