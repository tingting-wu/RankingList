
import { Redis } from 'ioredis';
import { dailyLogger } from './../commom/logger'

function connectRedis() {
    const client = new Redis({
        port: 6379,
        host: "127.0.0.1",
        db: 0,
      });

    return new Promise((resolve, reject) => {
        client.on('connect', () => {
            console.log("redis链接成功");
            dailyLogger.info('redis链接成功');
            resolve(client);
        })

        client.on('error', () => {
            console.error("redis链接失败");
            dailyLogger.info('redis链接失败');
            reject(client);
        })
    })
}

module.exports = {
    connectRedis
}