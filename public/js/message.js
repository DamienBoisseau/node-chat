var socket = io();

// Insert message inside the chat container when received from the server
socket.on('message', function(message) {
  insertMessage(message);
});

// Insert notification inside the chat container when a user joins
socket.on('join', function(text) {
  insertNotification(text);
});

// Insert notification inside the chat container when a user leaves
socket.on('leave', function(text) {
  insertNotification(text);
});

$(function() {

  // Ask user's name
  var username;
  while(!username) {
    username = window.prompt('Enter your name');
  }
  // Emit it to the server
  socket.emit('join', username);

  // Insert join message inside the chat container
  insertNotification(username + ' has joined');

  $('#form').on('submit', function(event) {
    event.preventDefault();

    // Get user input and emit it to the server
    var input = $('#message');
    var message = input.val();

    if(message != '') {
      socket.emit('message', username, message);

      // Clear input value and give back the focus to it
      input.val('').focus();

      // Insert message inside the chat container
      insertMessage(username, message);
    }
  });

});
