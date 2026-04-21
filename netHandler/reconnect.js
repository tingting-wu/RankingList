import logger from '../commom/logger.js';

export async function handle(ws, params, clients) {
    const { uid, sceneData } = params;
    
    if (!uid) {
        throw new Error('Missing uid');
    }

    ws.uid = uid;
    clients.set(uid, ws);
    
    logger.info(`User ${uid} reconnected, sceneData: ${JSON.stringify(sceneData || {})}`);

    return { 
        uid,
        sceneData: sceneData || {}
    };
}
