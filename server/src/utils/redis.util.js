import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: process.env.REDIS_UPLOAD_URL,
  token: process.env.REDIS_TOKEN,
})


async function redisUtil(key,value){
    try {
        await redis.setex(key,60,value);
    } catch (error) {
        console.error("Error setting value in Redis:", error);
    }
    
}

async function redisUtilGet(key){
    try {
        const data = await redis.get(key);
    return data;
    } catch (error) {
        console.error("Error getting value in Redis:", error);
    }
    
}

export {redisUtil,redisUtilGet};