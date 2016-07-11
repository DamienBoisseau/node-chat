// Turns &, <, > and " into html entities
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Scroll on incoming message
function scrollDown() {
  // Detect if the user has scrolled to the bottom.
  var willScroll = false;
  if($('#messages').scrollTop() + $('#messages').innerHeight() >= $('#messages')[0].scrollHeight-50) {
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }
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
  scrollDown();
}

// Append JOIN notification to the chat container
function insertJoinNotification(data) {
  $('#messages').append('<div class="notification"><p><i>' + htmlEntities(data.username) + ' has joined</i></div>');
  scrollDown();
}

// Append LEAVE notification to the chat container
function insertLeaveNotification(data) {
  $('#messages').append('<div class="notification"><p><i>' + htmlEntities(data.username) + ' has left</i></div>');
  scrollDown();
}

// Add user to the user list
function addUser(data) {
  $('#users').append('<li id="user-' + data.userid + '">' + data.username + '</li>');
}

// Remove user from the users list
function removeUser(data) {
  $('#users').find('#user-' + data.userid).remove();
}

// Add "is typing" next to the user name when this user is... typing
function setTyping(data) {
  if(data.isTyping === true) {
    $('#user-' + data.userid).append('<em> is typing...</em>');
  }
  else {
    $('#user-' + data.userid + ' em').remove();
  }
}