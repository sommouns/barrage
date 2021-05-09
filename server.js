const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const redis = require("redis");
const client = redis.createClient();
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    client.rpush('barrages', data, redis.print)
    ws.send({
      type: 'ADD',
      data: JSON.stringify(data)
    })
  });

  ws.send('something');
});