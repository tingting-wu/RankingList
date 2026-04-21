import { startWebSocketServer } from './net/ws.js';
import { initRedis } from './db/redisConnect.js';
import logger from './commom/logger.js';
import fs from 'fs';

async function loadConfig() {
    const wsConfig = JSON.parse(fs.readFileSync('./config/ws.json', 'utf-8'));
    const rankingConfig = JSON.parse(fs.readFileSync('./config/ranking.json', 'utf-8'));
    return { wsConfig, rankingConfig };
}

async function main() {
    try {
        logger.info('Starting RankingList Server...');
        
        await initRedis();
        logger.info('Redis connected');

        const config = await loadConfig();
        global.wsConfig = config.wsConfig;
        global.rankingConfig = config.rankingConfig;
        logger.info('Config loaded');

        startWebSocketServer();
        logger.info('WebSocket server started on port 3000');
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();
