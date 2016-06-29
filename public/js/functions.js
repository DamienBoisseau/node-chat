// Turns &, <, > and " into html entities
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Append incoming messages to the chat container
function insertMessage(usr, msg) {
  $('#messages').append('<div class="message"><p><b>' + htmlEntities(usr) + '</b> : ' + htmlEntities(msg) + '</p></div>');
}

// Append notification to the chat container
function insertNotification(txt) {
  $('#messages').append('<div class="notification"><p><i>' + htmlEntities(txt) + '</i></div>');
}
