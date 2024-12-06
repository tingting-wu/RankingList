# RankingList
1系统首先选用ws作为前后端通讯，根据课题的实时上报，查询等功能，针对ws需要做的以下几点
  1.1 确保后端的安全性，在后端解析的过程中，将一些恶意查询等拦截掉。可以通过解析参数或者玩家查询为返回的状态下，将下次同玩家的查询等请求拦截掉。
  2.1 确保与前端的实时链接的状态，可以通过心跳解决，在心跳中设置参数，参数可以为时间戳等实时信息。
  3.1 在ws设置中，应该有一个前后端实时区分不同链接的文件，可以在文件中通过不同的参数，比如参数为协议号（可以为16进制数字），链接名字等区分。
      除此之外还可以起到安全性作用（比如恶意查询等，不在文件中的不让操作）。
      目前根据要求，有以下几个协议(协议号从10000开始)
      心跳:2710_cs_heartBeat, 2710_sc_heartBeat{timestamp:number} // 系统功能
      客户端主动断开链接：2711_cs_disconnect{uid: number, reason: number} 2711_sc_disconnect{}// reason为全局枚举类型，用数字进行定义
      重链:2711_cs_reconnect{uid: number} 2711_sc_reconnect{}// 目前只有玩家uid一种，在不同场景下需要不同的参数，战斗状态下需要携带的buff等，地图上需要地图id等
      查询玩家自己排行榜或者查询总榜数据:2712_cs_get_rankingList{uid: number, type: number, page:number, item:number} 2712_sc_get_rankingList{uid: number, score: number，rank: number, nearRankingList:obj} 
      // type为不同的排行榜, obj为Object类型的结构体，有uid，score，rank的信息, page为第几页，item每页的条数
      推送玩家自己排行榜数据:2713_sc_send_rankingList{uid: number, type:number, score: number，rank: number}
2 针对功能来说
  2.1 玩家在线状态与不在线状态（玩家状态可以通过布隆过滤器来实现，100万的数据大约需要30M的存储空间）
  2.2 排行榜可以存储为redis的zset类型，redis集群部署，一主一从或者一主两从都可以（因为存储方式为哈希槽，所以数据存储比较均衡）
  
  
