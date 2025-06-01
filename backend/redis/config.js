import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisConnection = new Redis(
  `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
  {
    maxRetriesPerRequest: null,
  }
);
