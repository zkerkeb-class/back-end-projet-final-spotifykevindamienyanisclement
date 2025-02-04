import Redis from 'ioredis';
import logger from '../config/logger';

let redisClient: Redis | null = null;

if (process.env.INSTALL_REDIS === 'true') {
    redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (error) => {
        logger.error('Redis error: ', error);
    });
}

export default redisClient;
