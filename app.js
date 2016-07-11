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
var nextUserId = 1;
var storeMessage = function(data) {
  sentMessages.push({username: data.username,  message: data.message});
  if(sentMessages.length > messageStorageLimit) {
    sentMessages.shift();
  }
}
var storeUser = function(usr) {
  connectedUsers.push({userid: nextUserId, username: usr});
  nextUserId++;
}
var removeUser = function(id) {

  connectedUsers.map(function(element, index, array) {
    if(element.userid == id) {
      array.splice(index, 1);
    }
  });
}

// Socket stuff
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(client) {

  client.on('join', function(username) {
    client.username = username;
    client.userid = nextUserId;
    storeUser(username);

    // Print to the new user the last messages sent
    sentMessages.forEach(function(data){
      client.emit('message', data);
    });

    // Show to the new user all the users already connected
    connectedUsers.forEach(function(data){
      client.emit('addUser', {userid: data.userid, username: data.username});
    });
    
    console.log(username + ' has joined');
    client.broadcast.emit('join', {userid: client.userid, username: client.username});
    client.broadcast.emit('addUser', {userid: client.userid, username: client.username});
    client.emit('join', {userid: client.userid, username: client.username});
  });

  client.on('disconnect', function() {
    removeUser(client.userid);

    console.log(client.username + ' has left');
    client.broadcast.emit('leave', {userid: client.userid, username: client.username});
    client.broadcast.emit('removeUser', {userid: client.userid, username: client.username});
  });

  client.on('message', function(data) {
    storeMessage(data);

    console.log('Message reçu de ' + data.username + ' : \"' + data.message + '\"');
    client.broadcast.emit('message', data);
  });

  client.on('typing', function(isTyping) {
    console.log(client.username + ' is typing...');
    client.broadcast.emit('typing', {userid: client.userid, isTyping: isTyping});
  });
  
});

// Listen on port 3000
server.listen(3000);
