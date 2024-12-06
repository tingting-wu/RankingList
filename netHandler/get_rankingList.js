import { getAsync, getZsetRange, zsetZadd, publish } from '../db/redis'

// 更新玩家自己的排名记录，同时将自己排名下的玩家通知到客户端
// 查找config目录下的ranking.json 文件，确定是那个排行榜
async function updateRankingList(type, user, value){
     
}







