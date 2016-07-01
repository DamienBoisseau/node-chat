// Turns &, <, > and " into html entities
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Append incoming messages to the chat container
function insertMessage(usr, msg, isOwnMessage) {
  var messageClass;
  var messageToDisplay;
  if(isOwnMessage === true) {
    messageClass = 'is-own-message';
    messageToDisplay = '<p>' + htmlEntities(msg) + '</p>';
  }
  else {
    messageToDisplay = '<p><b>' + htmlEntities(usr) + '</b> : ' + htmlEntities(msg) + '</p>';
  }

  $('#messages').append('<div class="message ' + messageClass + '">' + messageToDisplay + '</div>');
}

// Append JOIN notification to the chat container and add user to the user list
function insertJoinNotification(data) {
  $('#messages').append('<div class="notification"><p><i>' + htmlEntities(data.username) + ' has joined</i></div>');
  $('#users').append('<li id="user-' + data.userid + '">' + data.username + '</li>');
}

// Append LEAVE notification to the chat container and remove user from the users list
function insertLeaveNotification(data) {
  $('#messages').append('<div class="notification"><p><i>' + htmlEntities(data.username) + ' has left</i></div>');
  $('#users').find('#user-' + data.userid).remove();
}
