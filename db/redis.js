import { Module } from 'module';
import { connectRedis } from './redisConnect';

async function getEey(type, key){
    if(type == 'list'){
        return 'list:' + key;
    } else if(type == "string"){
        return 'string:' + key;
    } else if(type == 'zset'){
        return 'zset:' + key;
    } else if(type == 'hash'){
        return 'hash:' + key;
    } else if(type == 'set'){
        return 'set:' + key;
    }
}

async function setAsync(type, key, value) {
    const client = await connectRedis();
    try {
        key = await getEey(type, key);
        const result = await client.set(key,value);
        console.log('键值对设置成功');
        return result;
    } catch (error){
        console.error('键值对设置失败', error);
        throw error;
    }
}

async function getAsync(key) {
    const client = await connectRedis();

    try {
        key = await getEey(type, key);
        const result = await client.get(key);
        console.log('获取key值成功');
        return result;
    } catch (error){
        console.log('获取key值失败');
        throw error;
    }
}

// 分页查询
async function getZsetRange(key, from, to) {
    const client = await connectRedis();

    try {
        key = await getEey(type, key);
        const result = await client.ZREVRANGE(key, from, to, 'withScores');
        console.log('获取key值成功');
        return result;
    } catch (error){
        console.log('获取key值失败');
        throw error;
    }
}

// 插入或者更新数据
async function zsetZadd(key, uid, value) {
    const client = await connectRedis();

    try {
        key = await getEey(type, key);
        const result = await client.zadd(key, uid, value);
        console.log('获取key值成功');
        return result;
    } catch (error){
        console.log('获取key值失败');
        throw error;
    }
}

// 获取排名
async function zrank(key, uid) {
    const client = await connectRedis();

    try {
        key = await getEey(type, key);
        const result = await client.zrank(key, uid);
        console.log('获取排行榜成功');
        return result;
    } catch (error){
        console.log('获取排行榜失败');
        throw error;
    }
}

async function publish(channel, message) {
    const client = await connectRedis();

    try {
        const result = await client.publish(channel, JSON.stringify(message));
        console.log('消息发布成功');
        return result;
    } catch (error){
        console.log('消息发布成功');
        throw error;
    }
}

async function subscribe(channel) {
    const client = await connectRedis();

    try {
        const result = await client.subscribe(channel);
        console.log('消息发布成功');
        return result;
    } catch (error){
        console.log('消息发布成功');
        throw error;
    }
}


module.exports = {
    setAsync,
    getAsync,
    getZsetRange,
    zsetZadd,
    zrank,
    publish,
    subscribe
}