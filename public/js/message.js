var socket = io();

// Insert message inside the chat container when received from the server
socket.on('message', function(data) {
  insertMessage(data.username, data.message, false);
});

// Insert notification inside the chat container when a user joins
socket.on('join', function(data) {
  insertJoinNotification(data);
});

// Insert notification inside the chat container when a user leaves
socket.on('leave', function(data) {
  insertLeaveNotification(data);
});

// Add a new user to the user list
socket.on('addUser', function(data) {
  addUser(data);
});

// Remove a leaving user from the user list
socket.on('removeUser', function(data) {
  removeUser(data);
});

// Notify user when someone is currently typing
socket.on('typing', function(data) {
  setTyping(data);
});

$(function() {

  // Ask user's name
  var username;
  while(!username) {
    username = window.prompt('Enter your name');
  }
  // Emit it to the server
  socket.emit('join', username);

  $('#form').on('submit', function(event) {
    event.preventDefault();

    // Get user input and emit it to the server
    var input = $('#message');
    var message = input.val();

    var data = {
      username: username,
      message: message
    }

    if(message != '') {
      socket.emit('message', data);

      // Clear input value and give back the focus to it
      input.val('').focus();

      // Insert message inside the chat container
      insertMessage(username, message, true);
    }
  });

  // Emit event when a user starts typing
  var isTyping = false;

  $('#message').on('keyup', function() {
    // Check if the input is empty
    if($(this).val() != '') {
      if(isTyping === false) {
        isTyping = true;
        socket.emit('typing', isTyping);
      }
    }
    else {
      isTyping = false;
      socket.emit('typing', isTyping);
    }
  });

});
