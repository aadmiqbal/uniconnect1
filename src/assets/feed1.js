let imagesrc = '../../content/images/pp.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function greet(finalUsers, currentUser, postFriendship, currentFriendships) {
  await sleep(2000);
  console.log('pre function');

  await displayFriends(currentFriendships, finalUsers, currentUser);

  console.log('post function');

  let i = 1;

  // loop through appUsers
  for (const user of finalUsers) {
    const isFriend = currentFriendships.some(friendship => {
      return (
        (friendship.finalUser.id === currentUser && friendship.finalUser2.id === user.id) ||
        (friendship.finalUser.id === user.id && friendship.finalUser2.id === currentUser)
      );
    });

    if (user.id == currentUser || isFriend) {
      //go to the next user without doing anything
      continue;
    }

    let imagesrc1 = '../../content/images/pp.png';
    if (user.pfp) {
      imagesrc1 = user.pfp;
    }

    let myPanel = document.createElement('div');
    myPanel.className = 'card mb-3';
    myPanel.style.maxWidth = 'max-content';
    myPanel.id = i + 'cardsection';

    let row = document.createElement('div');
    row.className = 'row g-0';

    let colMd4 = document.createElement('div');
    colMd4.className = 'col-md-4';

    let img = document.createElement('img');
    img.src = imagesrc1;
    img.className = 'img-fluid rounded-start rounded';
    img.alt = 'Profile';

    colMd4.appendChild(img);

    let colMd8 = document.createElement('div');
    colMd8.className = 'col-md-8';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = 'Full name: ' + '  ' + user.firstName + ' ' + user.lastName;

    let yearstudy = document.createElement('p');
    yearstudy.className = 'card-text';
    yearstudy.textContent = 'Year of study: ' + user.studyYear;

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = 'Biography: ' + user.bio;
    cardText.title = 'Year Of Study' + user.studyYear;

    let btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn-close float-end';
    btnClose.setAttribute('aria-label', 'Close');
    btnClose.dataset.target = '#' + i + 'cardsection';
    btnClose.dataset.dismiss = 'alert';
    btnClose.addEventListener('click', function (e) {
      e.stopPropagation();
      myPanel.style.display = 'none';
      myPanel.parentNode.removeChild(myPanel);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(btnClose);
    cardBody.appendChild(yearstudy);
    cardBody.appendChild(cardText);
    //cardBody.appendChild(small);

    colMd8.appendChild(cardBody);

    row.appendChild(colMd4);
    row.appendChild(colMd8);

    myPanel.appendChild(row);
    myPanel.addEventListener('click', showUser.bind(cardBody, user, currentUser, postFriendship));

    document.getElementById('cardsection').appendChild(myPanel);

    i++;
  }
}

function showUser(user, currentUser, postFriendship) {
  if (document.getElementById('popupHolder') == null) {
    let popupHolder = document.createElement('div');
    popupHolder.id = 'popupHolder';
    popupHolder.style.display = 'flex';
    popupHolder.style.justifyContent = 'center';
    popupHolder.style.left = '0';
    popupHolder.style.zIndex = '999';
    popupHolder.style.width = '100%';

    let profilePopup = document.createElement('div');
    profilePopup.id = 'userPopup';
    profilePopup.style.margin = 'auto';

    profilePopup.style.maxWidth = 'max-content';

    profilePopup.style.display = 'flex';
    profilePopup.style.flexDirection = 'column';
    profilePopup.style.zIndex = '999';
    profilePopup.style.border = '3px solid';
    profilePopup.style.borderRadius = '10px';
    profilePopup.style.position = 'absolute';
    profilePopup.style.backgroundColor = 'white';
    profilePopup.style.marginTop = 'auto';
    profilePopup.style.minWidth = '600px';

    populatePopup(profilePopup, user, currentUser, postFriendship);

    popupHolder.prepend(profilePopup);

    document.getElementById('popupAdder').prepend(popupHolder);
  }
  return null;
}

function populatePopup(profilePopup, user, currentUser, postFriendship) {
  let topRow = document.createElement('div');
  topRow.style.display = 'table-row';

  let trl = document.createElement('div');
  trl.id = 'trl';
  trl.style.display = 'table-cell';
  trl.style.padding = '10px';
  trl.style.whiteSpace = 'nowrap';
  let trm = document.createElement('div');
  trm.style.display = 'table-cell';
  trm.style.padding = '10px';
  trm.style.whiteSpace = 'nowrap';
  trm.style.width = '100%';
  let trr = document.createElement('div');
  trr.style.display = 'table-cell';
  trr.style.right = '0px';
  trr.style.top = '0px';
  trr.style.verticalAlign = 'top';
  trr.style.padding = '10px';
  trr.style.whiteSpace = 'nowrap';

  let img = document.createElement('img');
  if (user.pfp) {
    img.src = user.pfp;
  } else {
    img.src = imagesrc;
  }
  img.id = 'img_field';
  img.alt = 'Profile';
  img.width = 150; //TODO: change?
  img.style.top = '0px';
  img.style.right = '0px';

  let nameField = document.createElement('h2');
  nameField.textContent = user.firstName + ' ' + user.lastName;
  nameField.style.verticalAlign = 'top';

  let courseField = document.createElement('p');
  courseField.textContent = 'Course: Computer Science '; // forgot 2 store course lmao maybe one day in future will let non comp sci ppl + user.course; //TODO: check if course is fetched
  courseField.style.verticalAlign = 'top';

  let closeButton = document.createElement('button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.dataset.dismiss = 'alert';
  closeButton.textContent = 'X';
  closeButton.style.border = 'none';
  const func = function () {
    document.getElementById('popupAdder').removeChild(document.getElementById('popupHolder'));
  }; //TODO: check if this works
  closeButton.addEventListener('click', func);

  trl.appendChild(img);

  trm.appendChild(nameField);
  trm.appendChild(courseField);

  trr.appendChild(closeButton);

  topRow.appendChild(trl);
  topRow.appendChild(trm);
  topRow.appendChild(trr);

  let bottomRow = document.createElement('div');
  bottomRow.style.display = 'table-row';
  bottomRow.style.width = '100%';

  let brl = document.createElement('div');
  brl.id = 'brl';
  brl.style.display = 'table-cell';
  brl.style.padding = '10px';
  brl.style.whiteSpace = 'nowrap';
  brl.style.minWidth = (img.width + 20).toString() + 'px';
  let brm = document.createElement('div');
  brm.id = 'brm';
  brm.style.display = 'table-cell';
  brm.style.padding = '10px';
  brm.style.width = '100%';
  brm.style.whiteSpace = 'nowrap';
  let brr = document.createElement('div');
  brr.id = 'brr';
  brr.style.display = 'table-cell';
  brr.style.padding = '10px';
  brr.style.minWidth = '91px'; //cheating?
  brr.style.whiteSpace = 'nowrap';

  let modulesField = document.createElement('pre');
  modulesField.id = 'modulesField';
  modulesField.style.padding = '10px';

  const containerWidth = 450; // can change
  const font = '16px Arial'; // can also change
  const lines = splitModulesToFit(user.modules, containerWidth, font);

  modulesField.textContent = 'Modules:\n' + lines.join('\n');

  /*for (let i = 0; i < 4; i++) {
    //const module = user.module[i];
    let li = document.createElement('li');
    li.className = 'module-element-' + String(i);
    li.textContent = 'Module' + String(i);
    modulesField.appendChild(li);
  } */

  let bioField = document.createElement('p');
  bioField.id = 'bioField';
  bioField.className = 'popupItem';
  bioField.textContent = user.bio;
  bioField.style.fontStyle = 'italic';
  bioField.style.width = '100%';

  let connectButton = document.createElement('button');
  connectButton.id = 'connectButton';
  connectButton.textContent = 'Connect';
  connectButton.style.border = 'none';
  connectButton.style.textAlign = 'center';
  connectButton.style.position = 'absolute';
  connectButton.style.bottom = '10px'; //TODO: done 'cheating'

  const connect = function (currentUserId, otherUserId) {
    postFriendship(currentUserId, otherUserId);
  };
  connectButton.addEventListener('click', () => connect(currentUser, user.id));

  brl.appendChild(modulesField);
  brm.appendChild(bioField);
  brr.appendChild(connectButton);

  bottomRow.appendChild(brl);
  bottomRow.appendChild(brm);
  bottomRow.appendChild(brr);

  profilePopup.appendChild(topRow);
  profilePopup.appendChild(bottomRow);
}

function selectPicture(picture) {
  // Remove selected class from all pictures
  const pictures = document.querySelectorAll('.picture-container img');
  pictures.forEach(p => p.classList.remove('selected'));

  // Add selected class to clicked picture
  picture.classList.add('selected');
  // Return the path of the clicked picture
  console.log(picture.src);
  return picture.src;
}

// Function to open popup
function openPopup() {
  document.getElementById('popupContainer').style.display = 'flex';
}

// Function to close popup
function closePopup() {
  document.getElementById('popupContainer').style.display = 'none';
}

function fetchUsersByIdsFromApi(userIds, finalusers) {
  return finalusers.filter(user => userIds.includes(user.id));
}

async function fetchUsersByIds(userIds, finalusers) {
  // Replace this with a call to the actual API endpoint that fetches users by IDs
  const users = fetchUsersByIdsFromApi(userIds, finalusers);

  // Create a map of user objects indexed by their IDs
  const usersMap = {};
  for (const user of users) {
    usersMap[user.id] = user;
  }

  return usersMap;
}

// Function to display friends list
async function displayFriends(currentfriendships, finalusers, currentUserId) {
  console.log('currentFriendships in displayFriends:', currentfriendships); // Add this line to check the data
  console.log('function is actually called');
  // Extract unique user IDs from currentFriendships
  const userIds = Array.from(new Set(currentfriendships.flatMap(friendship => [friendship.finalUser.id, friendship.finalUser2.id])));

  // Fetch users data
  const usersMap = await fetchUsersByIds(userIds, finalusers);

  // Update finalUser and finalUser2 objects with the fetched data
  currentfriendships = currentfriendships.map(friendship => ({
    ...friendship,
    finalUser: usersMap[friendship.finalUser.id],
    finalUser2: usersMap[friendship.finalUser2.id],
  }));

  // Get the section element where we want to display the cards
  let section = document.getElementById('list');

  // Clear any previous content
  section.innerHTML = '';

  // Loop through the friends array and create a card for each friend
  for (const friendship of currentfriendships) {
    let friend;

    if (friendship.finalUser && friendship.finalUser.id === currentUserId) {
      friend = friendship.finalUser2;
    } else if (friendship.finalUser2 && friendship.finalUser2.id === currentUserId) {
      friend = friendship.finalUser;
    }

    if (!friend) {
      console.log('not friend');
      continue;
    }
    console.log('found a friend');
    // Create the card container
    let card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Create the card body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create the card title with the friend's name
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = friend.name;

    // Create the profile picture and add it to the card
    let profilePic = document.createElement('img');
    profilePic.classList.add('rounded', 'float-end');
    profilePic.style.width = '75px';
    profilePic.style.height = '75px';
    profilePic.style.objectFit = 'cover';
    if (friend.pfp) {
      profilePic.src = friend.pfp;
    } else {
      profilePic.src = imagesrc;
    }
    cardBody.appendChild(profilePic);

    let chatButtonHolder = document.createElement('a');
    chatButtonHolder.setAttribute('routerlink', 'chat-group');
    chatButtonHolder.setAttribute('routerlinkactive', 'active');
    chatButtonHolder.setAttribute('ng-reflect-router-link', 'chat-group');
    chatButtonHolder.setAttribute('ng-reflect-router-link-active', 'active');
    chatButtonHolder.href = '/chat-group';

    let chatButton = document.createElement('button');
    chatButton.textContent = 'Chat';
    chatButton.style.border = 'None';
    chatButton.style.width = '100%';

    chatButtonHolder.appendChild(chatButton);

    // Add the title and text to the card body
    cardBody.appendChild(cardTitle);
    // Add the card body to the card container
    card.appendChild(cardBody);
    card.appendChild(chatButtonHolder);

    // Add the card to the section
    section.appendChild(card);
  }
}

/* function createModulesArray(modules) {
    // Split the string into an array using the comma as the separator
    const modulesArray = modules.split(',');

    // Trim any whitespace from each module
    const trimmedModulesArray = modulesArray.map(module => module.trim());

    return trimmedModulesArray;
  }

  const modulesString = user.modules;
  const modulesArray = createModulesArray(modulesString);
  console.log(modulesArray); // Output: ["module1", "module2", "module3"]


  let modulesField = document.createElement('ul');
  modulesField.id = 'modulesField';
  modulesField.style.padding = '10px';
  modulesField.textContent = 'Modules:';

  for (let i = 0; i < modulesArray.length; i++) {
    const module = modulesArray[i];

  }

  */
function splitModulesToFit(modulesString, containerWidth, font) {
  const modules = modulesString.split(',');
  const separator = ', ';

  let lines = [];
  let currentLine = '';

  for (const module of modules) {
    const currentLineWidth = measureTextWidth(currentLine + module + separator, font);
    if (currentLineWidth > containerWidth) {
      lines.push(currentLine.trim());
      currentLine = module + separator;
    } else {
      currentLine += module + separator;
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}
function measureTextWidth(text, font) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
}

// Function to display requests list
