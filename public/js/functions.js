// Turns &, <, > and " into html entities
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Append incoming messages to the chat container
function insertMessage(msg) {
  $('#messages').append('<p>' + htmlEntities(msg) + '</p>');
}