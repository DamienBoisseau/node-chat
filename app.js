var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', function(client) {

  client.on('join', function(username) {
    client.username = username;
    
    console.log(username + ' has joined');
    client.broadcast.emit('join', username + ' has joined');
  });

  client.on('disconnect', function() {
    console.log(client.username + ' has left');
    client.broadcast.emit('leave', client.username + ' has left');
  });

  client.on('message', function(username, message) {
    console.log('Message reçu de ' + username + ' : \"' + message + '\"');
    client.broadcast.emit('message', username + ' : ' + message);
  });
  
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000);
