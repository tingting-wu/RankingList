export async function handle(ws, params) {
    const { timestamp } = params;
    ws.lastHeartbeat = Date.now();
    ws.isAlive = true;
    return { timestamp: Date.now() };
}
