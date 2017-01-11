// Express stuff
var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Redis client
var redis = require('redis');
var redisClient = redis.createClient();

// Users and messages storage
var messageStorageLimit = 100;
var connectedUsers = [];
var nextUserId = 1;
var storeMessage = function(data) {
  var message = JSON.stringify({username: data.username, message: data.message});
  redisClient.lpush('messages', message, function(err, res) {
    redisClient.ltrim('messages', 0, messageStorageLimit-1); 
  });
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
    redisClient.lrange('messages', 0, -1, function(err, messages) {
      messages = messages.reverse();
      
      messages.forEach(function(message){
        data = JSON.parse(message);
        client.emit('message', data);
      });
    })

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

    console.log('Message from ' + data.username + ' : \"' + data.message + '\"');
    client.broadcast.emit('message', data);
  });

  client.on('typing', function(isTyping) {
    client.broadcast.emit('typing', {userid: client.userid, isTyping: isTyping});
  });
  
});

// Listen on port 3000
server.listen(3000);
