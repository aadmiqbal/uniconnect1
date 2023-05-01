function purgeInitialText() {
  let loadText = document.getElementById('loadMsg');
  if (loadText !== null) {
    loadText.remove();
    let chats = document.getElementById('chats');
    chats.style.overflowY = 'scroll';
    chats.style.display = '';
    chats.style.justifyContent = '';
    chats.style.alignItems = '';
  }
}

function writeMessages(messages) {
  alert('Javascript file loaded');
  if (messages.length != 0) {
    purgeInitialText();
  }

  for (let i = 0; i < messages.length; i++) {
    document.getElementById('chats').appendChild(createMessage(messages[i].content, messages[i].senderId));
  }
}

function createMessage(messageText, sender) {
  let messageHolder = document.createElement('div');
  messageHolder.style.paddingTop = '10px';
  messageHolder.style.display = 'flex';
  messageHolder.style.flexDirection = 'column';

  let content = document.createElement('div');
  content.style.height = 'auto';

  let message = document.createElement('p');

  message.textContent = messageText;
  message.style.maxWidth = '70%';
  message.style.textAlign = 'right';
  message.style.paddingRight = '10px';
  message.style.paddingLeft = '10px';
  message.style.borderRadius = '10px';
  message.style.fontSize = '18px;';

  let userPfp = document.createElement('img');
  userPfp.src = '../../content/images/pp.png';
  userPfp.style.borderRadius = '100%';
  userPfp.style.borderRadius = '100%';
  userPfp.style.top = '0px';
  userPfp.style.right = '0px';
  userPfp.style.height = '30px';
  userPfp.style.width = '50px';
  userPfp.style.paddingRight = '10px';
  userPfp.style.paddingLeft = '10px;';

  if (sender == userId) {
    message.style.backgroundColor = 'orange';
    message.style.float = 'right';
    userPfp.style.float = 'right';
    messageHolder.style.alignItems = 'right';
  } else {
    message.style.backgroundColor = 'grey';
    message.style.float = 'left';
    userPfp.style.float = 'left';
    messageHolder.style.alignItems = 'left';
  }

  content.appendChild(userPfp);
  content.appendChild(message);

  messageHolder.appendChild(content);

  return messageHolder;
}
