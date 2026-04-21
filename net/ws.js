import { Server } from 'ws';
import logger from '../commom/logger.js';

const clients = new Map();

export function startWebSocketServer(port = 3000) {
    const wss = new Server({ port });

    wss.on('connection', function connection(ws, req) {
        const clientIp = req.socket.remoteAddress;
        logger.info(`New connection from ${clientIp}`);

        ws.isAlive = true;
        ws.uid = null;

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', async function incoming(message) {
            try {
                const data = JSON.parse(message);
                const { protocolId, ...params } = data;

                if (!global.wsConfig[protocolId]) {
                    logger.warn(`Unknown protocol: ${protocolId} from ${clientIp}`);
                    ws.send(JSON.stringify({ protocolId: protocolId + '_sc', data: {}, code: -1, msg: 'Unknown protocol' }));
                    return;
                }

                const handlerName = global.wsConfig[protocolId];
                const handler = await import(`../netHandler/${handlerName}.js`);

                if (handler && handler.handle) {
                    handler.handle(ws, params, clients).then(response => {
                        if (response) {
                            ws.send(JSON.stringify({
                                protocolId: protocolId + '_sc',
                                data: response,
                                code: 0,
                                msg: 'success'
                            }));
                        }
                    }).catch(err => {
                        logger.error(`Handler error: ${handlerName}`, err);
                        ws.send(JSON.stringify({ protocolId: protocolId + '_sc', data: {}, code: -1, msg: err.message }));
                    });
                } else {
                    logger.warn(`Handler not found: ${handlerName}`);
                }
            } catch (error) {
                logger.error('Message parse error:', error);
            }
        });

        ws.on('close', function close() {
            logger.info(`Connection closed: ${ws.uid || clientIp}`);
            if (ws.uid) {
                clients.delete(ws.uid);
            }
        });

        ws.on('error', function error(e) {
            logger.error(`WebSocket error from ${clientIp}:`, e);
        });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) {
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', () => {
        clearInterval(interval);
    });

    return wss;
}

export { clients };
