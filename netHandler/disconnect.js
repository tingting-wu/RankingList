import logger from '../commom/logger.js';

const DISCONNECT_REASON = {
    USER_LOGOUT: 1,
    KICKED_BY_ADMIN: 2,
    SERVER_SHUTDOWN: 3,
    NETWORK_ERROR: 4,
    UNKNOWN: 99
};

export async function handle(ws, params, clients) {
    const { uid, reason } = params;
    
    if (!uid) {
        throw new Error('Missing uid');
    }

    ws.uid = null;
    clients.delete(uid);
    
    logger.info(`User ${uid} disconnected, reason: ${reason || DISCONNECT_REASON.UNKNOWN}`);

    return { reason: reason || DISCONNECT_REASON.UNKNOWN };
}

export { DISCONNECT_REASON };
