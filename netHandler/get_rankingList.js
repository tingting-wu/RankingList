import { getAsync, getZsetRange, zsetZadd, publish, zrank } from '../db/redis'

// 更新玩家自己的排名记录，同时将自己排名下的玩家通知到客户端
// 查找config目录下的ranking.json 文件，确定是哪个排行榜
// user结构体中有uid
// 默认value分数大于旧分数，执行逻辑，否则不执行
async function updateRankingList(type, user, value) {
    let date = Math.floor(new Date() / 1000);
    let specificDate = new Date('2050-01-01T00:00:00Z');
    let newValue = value * Math.pow(10, 12) + specificDate.getTime() / 1000 - date;
    // 更新排行榜数据
    let result = await zsetZadd(type, user.uid, newValue);
    // 获取自己排名
    let rank = await zrank(type, user.uid);
    // 进入前100名的消息提醒
    if (rank <= 100) {

    }
    // 获取从自己排名后所有玩家数据
    let list = await getZsetRange(type, rank + 1, -1);
    for (let i of list) {
        // 查询每位玩家在线状态，不在线的不发送通知（此处省略）
        // 或者直接调用send_rankingList通过ws发送给客户端
    }
}

// 默认page>=1, 文档中每页默认值为100，item = 100
async function getRankingList(type, page, item) {
    let from = (page - 1) * item;
    let to = (page - 1) * item + item;
    // 获取从自己排名后所有玩家数据
    let list = await getZsetRange(type, from, to);
    // 将list中的value还原成分数， 直接/Math.pow(10, 12)，再向下取整
    return list;
}

// 查询指定玩家上下10名的玩家排名
async function getRankingList(type, user) {
    let list;
    // 获取自己排名
    let rank = await zrank(type, user.uid);
    if (rank < 10) {
        list = await getZsetRange(type, 0, rank + 10);
    } else {
        list = await getZsetRange(type, rank - 10, rank + 10);
    }
    // 将list中的value还原成分数， 直接/Math.pow(10, 12)，再向下取整
    return list;
}







