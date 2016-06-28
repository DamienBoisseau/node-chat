var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', function(client) {
  console.log('Client connecté !');

  client.on('message', function(data) {
    console.log('Message reçu : \"' + data + '\"')
    client.broadcast.emit('message', data);
  });
  
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000);
