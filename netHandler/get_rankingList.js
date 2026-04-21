import { getZsetRange, zsetZadd, zrank } from '../db/redis.js';
import logger from '../commom/logger.js';

const POWER = Math.pow(10, 12);
const SPECIFIC_DATE = new Date('2050-01-01T00:00:00Z').getTime();

function decodeScore(encodedValue) {
    return Math.floor(encodedValue / POWER);
}

async function updateRankingList(type, uid, value) {
    const now = Math.floor(Date.now() / 1000);
    const newValue = value * POWER + (SPECIFIC_DATE / 1000 - now);
    
    await zsetZadd('zset', type, uid, newValue);
    const rank = await zrank('zset', type, uid);
    
    if (rank < 100) {
        logger.info(`User ${uid} entered top 100, rank: ${rank}`);
    }
    
    return { rank, value };
}

export async function handle(ws, params, clients) {
    const { uid, type, page = 1, item = 100 } = params;

    if (!type) {
        throw new Error('Missing type');
    }

    const from = (page - 1) * item;
    const to = from + item - 1;

    const list = await getZsetRange('zset', type, from, to);
    
    const formattedList = [];
    for (let i = 0; i < list.length; i += 2) {
        formattedList.push({
            uid: list[i],
            score: decodeScore(parseFloat(list[i + 1])),
            rank: from + Math.floor(i / 2) + 1
        });
    }

    let myRank = null;
    let myScore = null;
    if (uid) {
        myRank = await zrank('zset', type, uid);
        if (myRank !== null && myRank !== undefined) {
            const fullList = await getZsetRange('zset', type, myRank, myRank);
            if (fullList && fullList.length > 1) {
                myScore = decodeScore(parseFloat(fullList[1]));
            }
        }
    }

    return {
        uid,
        type,
        page,
        item,
        myRank: myRank !== null ? myRank + 1 : null,
        myScore,
        rankingList: formattedList
    };
}

export { updateRankingList };
