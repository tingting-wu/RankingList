import { zrank, getZsetRange } from '../db/redis.js';
import logger from '../commom/logger.js';

const POWER = Math.pow(10, 12);

function decodeScore(encodedValue) {
    return Math.floor(encodedValue / POWER);
}

export async function handle(ws, params, clients) {
    const { uid, type, score } = params;

    if (!uid || !type) {
        throw new Error('Missing uid or type');
    }

    logger.info(`Sending ranking update to user ${uid}, type: ${type}, score: ${score}`);

    let myRank = null;
    if (score !== undefined) {
        const rank = await zrank('zset', type, uid);
        myRank = rank !== null ? rank + 1 : null;
    }

    return {
        uid,
        type,
        score,
        rank: myRank
    };
}

export async function notifyUser(uid, type, score, rank, clients) {
    const clientWs = clients.get(uid);
    if (clientWs && clientWs.readyState === 1) {
        clientWs.send(JSON.stringify({
            protocolId: '2713_sc',
            data: { uid, type, score, rank },
            code: 0,
            msg: 'success'
        }));
        logger.info(`Notified user ${uid} about ranking change`);
    }
}
