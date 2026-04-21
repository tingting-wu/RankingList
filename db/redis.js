import { getRedisClient } from './redisConnect.js';

function getKey(type, key) {
    return `${type}:${key}`;
}

async function setAsync(type, key, value) {
    const client = getRedisClient();
    try {
        key = getKey(type, key);
        const result = await client.set(key, value);
        console.log('键值对设置成功');
        return result;
    } catch (error) {
        console.error('键值对设置失败', error);
        throw error;
    }
}

async function getAsync(type, key) {
    const client = getRedisClient();
    try {
        key = getKey(type, key);
        const result = await client.get(key);
        console.log('获取key值成功');
        return result;
    } catch (error) {
        console.log('获取key值失败');
        throw error;
    }
}

async function getZsetRange(type, key, from, to) {
    const client = getRedisClient();
    try {
        key = getKey(type, key);
        const result = await client.zrevrange(key, from, to, 'WITHSCORES');
        console.log('获取key值成功');
        return result;
    } catch (error) {
        console.log('获取key值失败');
        throw error;
    }
}

async function zsetZadd(type, key, uid, value) {
    const client = getRedisClient();
    try {
        key = getKey(type, key);
        const result = await client.zadd(key, uid, value);
        console.log('插入成功');
        return result;
    } catch (error) {
        console.log('插入失败');
        throw error;
    }
}

async function zrank(type, key, uid) {
    const client = getRedisClient();
    try {
        key = getKey(type, key);
        const result = await client.zrevrank(key, uid);
        console.log('获取排名成功');
        return result;
    } catch (error) {
        console.log('获取排名失败');
        throw error;
    }
}

async function publish(channel, message) {
    const client = getRedisClient();
    try {
        const result = await client.publish(channel, JSON.stringify(message));
        console.log('消息发布成功');
        return result;
    } catch (error) {
        console.log('消息发布失败');
        throw error;
    }
}

async function subscribe(channel) {
    const client = getRedisClient();
    try {
        const result = await client.subscribe(channel);
        console.log('订阅成功');
        return result;
    } catch (error) {
        console.log('订阅失败');
        throw error;
    }
}

export {
    setAsync,
    getAsync,
    getZsetRange,
    zsetZadd,
    zrank,
    publish,
    subscribe
};
