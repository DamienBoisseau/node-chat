// Express stuff
var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Users and messages storage
var messageStorageLimit = 100;
var sentMessages = [];
var connectedUsers = [];
var storeMessage = function(data) {
  sentMessages.push({username: data.username,  message: data.message});
  if(sentMessages.length > messageStorageLimit) {
    sentMessages.shift();
  }
}
var storeUser = function(usr) {
  connectedUsers.push(usr);
}
var removeUser = function(usr) {
  connectedUsers.splice(connectedUsers.indexOf(usr));
}

// Socket stuff
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(client) {

  client.on('join', function(username) {
    client.username = username;
    storeUser(username);

    // Print to the new user the last messages sent
    sentMessages.forEach(function(data){
      client.emit('message', data);
    });
    
    console.log(username + ' has joined');
    client.broadcast.emit('join', username + ' has joined');
    client.emit('join', username + ' has joined');
  });

  client.on('disconnect', function() {
    removeUser(client.username);

    console.log(client.username + ' has left');
    client.broadcast.emit('leave', client.username + ' has left');
  });

  client.on('message', function(data) {
    storeMessage(data);

    console.log('Message reçu de ' + data.username + ' : \"' + data.message + '\"');
    client.broadcast.emit('message', data);
  });
  
});

// Listen on port 3000
server.listen(3000);
