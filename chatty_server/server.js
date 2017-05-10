const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const uuid = require('uuid/v1');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.broadcast = function broadcast(data){
  wss.clients.forEach(function each(client) {
    console.log('broadcast spam', client.readyState);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

function sendCount(wss) {
  const open = [];
  for (let client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      open.push(client);
    }
  }

  const message = { type: 'clientConnections', count: open.length };
  wss.broadcast(message);
}


wss.on('connection', (ws) => {
  console.log('Client connected');
  sendCount(wss);

  ws.on('message', function incoming(data) {
    console.log(data);
    const messData = JSON.parse(data);
    const broadcastInfo = {};
    broadcastInfo.id = uuid();
    if(messData.type === "postMessage") {
      console.log( `User ${messData.username} said ${messData.content}`);
      broadcastInfo.username = messData.username;
      broadcastInfo.type = "incomingMessage";
      broadcastInfo.content = messData.content;
    } else if(messData.type === "postUsernameChangeNotification") {
      broadcastInfo.type = "incomingNotification";
      broadcastInfo.content = `${messData.oldName} changed their name to ${messData.newName}`;
      console.log(broadcastInfo.content);
    }
    wss.broadcast(broadcastInfo);
  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    sendCount(wss);
  });
});
