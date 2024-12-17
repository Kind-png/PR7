const WebSocketServer = require('ws').WebSocketServer;

const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });


wss.on('connection', function connection(ws) {
  console.log('new connection');

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);

    wss.clients.forEach( function(client) {
      if(client!==ws){
        client.send(data);
      }
      
    })

  });

  ws.on('close', function close() {
    console.log('client disconnected');
  });
  
  ws.send('message from server');
});

