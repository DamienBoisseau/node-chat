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
  $('#messages').append('<p><b>' + htmlEntities(usr) + '</b> : ' + htmlEntities(msg) + '</p>');
}
