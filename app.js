// Express stuff
var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Socket stuff
var server = require('http').createServer(app);
var io = require('socket.io')(server);
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

  client.on('message', function(data) {
    console.log('Message reçu de ' + data.username + ' : \"' + data.message + '\"');
    client.broadcast.emit('message', data);
  });
  
});

// Listen on port 3000
server.listen(3000);
