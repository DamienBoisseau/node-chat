var socket = io();

// Insert message inside the chat container when received from the server
socket.on('message', function(message) {
  insertMessage(message);
});

$(function() {

  $('#form').on('submit', function(event) {
    event.preventDefault();

    // Get user input and emit it to the server
    var input = $('#message');
    var message = input.val();

    if(message != '') {
      socket.emit('message', message);

      // Clear input value and give back the focus to it
      input.val('').focus();

      // Insert message inside the chat container
      insertMessage(message);
    }
  });

});
