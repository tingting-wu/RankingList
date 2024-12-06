import { Server } from 'ws';
import { fs } from 'fs';
 
const wss = new Server({ port: 3000 });
 
wss.on('connection', function connection(ws) {
  console.log('连接建立');
 
  ws.on('message', function incoming(message) {
    console.log(message);
    // 解析收到的消息(协议号与协议内容等)，在根目录下config中的wsConfig文件中查找协议消息与序列号
    // 不符合要求的直接return掉，同时在logger中记录，可能需要记录下IP地址等(可能涉及违规操作等)
    // 参数校验后，将符合条件的请求将直接转换到netHandler目录下的具体业务逻辑
    let configdata = fs.readFileSync('./../config/ws.json', 'uTf-8');
    ws.send('你发送的消息已接收：' + message);
  });
 
  ws.on('close', function close() {
    console.log('连接断开');
  });
 
  ws.on('error', function error(e) {
    console.log('发生错误: %s', e);
  });
});