let imagesrc = '../../content/images/pp.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function greet(appUsers) {
  await sleep(2000);
  displayFriends();
  //TODO: will need to also pass in the current user
  // to filter out accounts in the feed based on modules,
  // if there is already a connection, if it is the user themself

  /*let head = document.getElementsByTagName('HEAD')[0];
  let cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';
  cssLink.href = 'connections-feed.component.scss';
  head.appendChild(cssLink);*/

  let i = 1;

  // loop through appUsers
  for (const user of appUsers) {
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
    cardTitle.textContent = 'Name: ' + '  ' + user.name;

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

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = 'Biography: ' + user.bio;
    cardText.title = 'Year Of Study' + user.studyYear;
    /*let small = document.createElement('small');
    small.className = 'text-muted';
    small.textContent = 'Last updated 3 mins ago';*/

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(btnClose);
    cardBody.appendChild(cardText);
    //cardBody.appendChild(small);

    cardBody.addEventListener('click', showUser.bind(cardBody, user));

    colMd8.appendChild(cardBody);

    row.appendChild(colMd4);
    row.appendChild(colMd8);

    myPanel.appendChild(row);

    document.getElementById('cardsection').appendChild(myPanel);

    i++;
  }
}

function showUser(user) {
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

    populatePopup(profilePopup, user);

    popupHolder.prepend(profilePopup);

    document.getElementById('popupAdder').prepend(popupHolder);
  }
  return null;
}

function populatePopup(profilePopup, user) {
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
  img.src = imagesrc;
  img.id = 'img_field';
  img.alt = 'Profile';
  img.width = 150; //TODO: change?
  img.style.top = '0px';
  img.style.right = '0px';

  let nameField = document.createElement('h2');
  nameField.textContent = user.name;
  nameField.style.verticalAlign = 'top';

  let courseField = document.createElement('p');
  courseField.textContent = 'Course: ' + user.course; //TODO: check if course is fetched
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

  let modulesField = document.createElement('ul');
  modulesField.id = 'modulesField';
  modulesField.style.padding = '10px';
  modulesField.textContent = 'Modules:';

  for (let i = 0; i < 4; i++) {
    //const module = user.module[i];
    let li = document.createElement('li');
    li.className = 'module-element-' + String(i);
    li.textContent = 'Module' + String(i);
    modulesField.appendChild(li);
  }

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

  /*const connect = function () {
    alert("'Connect' pushed!");
  }; //TODO: call backend to add connection
  connectButton.addEventListener('click', connect);
*/

  const connect = function () {
    const userId1 = document.getElementById('userId1').value; // Get the first user ID from the input field
    const userId2 = document.getElementById('userId2').value; // Get the second user ID from the input field

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId1: userId1, userId2: userId2 }),
    };

    fetch('http://localhost:8080/api/connections', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add connection');
        }
        alert('Connection added successfully!');
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add connection');
      });
  };

  connectButton.addEventListener('click', connect);

  brl.appendChild(modulesField);
  brm.appendChild(bioField);
  brr.appendChild(connectButton);

  bottomRow.appendChild(brl);
  bottomRow.appendChild(brm);
  bottomRow.appendChild(brr);

  profilePopup.appendChild(topRow);
  profilePopup.appendChild(bottomRow);
}

function addModuleLabel() {
  const moduleLabels = document.querySelector('#module-labels');
  const firstModuleLabel = moduleLabels.querySelector("label[for^='modules']");
  const firstModuleSelect = moduleLabels.querySelector("select[id^='modules']");
  const addButton = document.querySelector('#my-button');

  // Clone the first label and select dropdown and update the id
  const newModuleLabel = firstModuleLabel.cloneNode(true);
  const newModuleSelect = firstModuleSelect.cloneNode(true);
  const newModuleSelectId = 'modules' + (parseInt(newModuleSelect.id.slice(7)) + 1).toString();
  newModuleLabel.setAttribute('for', newModuleSelectId);
  newModuleSelect.setAttribute('id', newModuleSelectId);

  // Show the new label and select dropdown
  newModuleLabel.style.display = 'inline-block';
  newModuleSelect.style.display = 'inline-block';

  const brElement = document.createElement('br');

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', function () {
    moduleLabels.removeChild(newModuleLabel);
    moduleLabels.removeChild(newModuleSelect);
    moduleLabels.removeChild(removeBtn);
  });
  moduleLabels.appendChild(newModuleLabel);
  moduleLabels.appendChild(newModuleSelect);
  moduleLabels.appendChild(removeBtn);

  // Insert a line break element after the label element
  moduleLabels.appendChild(brElement);

  const br1 = document.createElement('br');
  const br2 = document.createElement('br');
  moduleLabels.appendChild(br1);
  moduleLabels.appendChild(removeBtn);
  moduleLabels.appendChild(br2);
}

// Define arrays
let friends = [
  { name: 'Roshaan', image: imagesrc, status: 'Online' },
  { name: 'Adam', image: imagesrc, status: 'Offline' },
  { name: 'Axel', image: imagesrc, status: 'Away' },
];
let requests = [
  { name: 'Krishaad', image: imagesrc },
  { name: 'Varan', image: imagesrc },
  { name: 'Einstein', image: imagesrc },
  { name: 'Robin', image: imagesrc },
];

// Function to display friends list
function displayFriends() {
  // Get the section element where we want to display the cards
  let section = document.getElementById('list');

  // Clear any previous content
  section.innerHTML = '';

  // Loop through the friends array and create a card for each friend
  for (let i = 0; i < friends.length; i++) {
    // Create the card container
    let card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Create the card body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create the card title with the friend's name
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = friends[i].name;

    // Create the card text with the friend's status
    let cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = 'Status: ' + friends[i].status;

    // Create the profile picture and add it to the card
    let profilePic = document.createElement('img');
    profilePic.classList.add('rounded', 'float-end');
    profilePic.style.width = '75px';
    profilePic.style.height = '75px';
    profilePic.style.objectFit = 'cover';
    profilePic.src = friends[i].image;
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
    cardBody.appendChild(cardText);

    // Add the card body to the card container
    card.appendChild(cardBody);
    card.appendChild(chatButtonHolder);

    // Add the card to the section
    section.appendChild(card);
  }
}

// Function to display requests list
function displayRequests() {
  // Get the section element where we want to display the cards
  let section = document.getElementById('list');

  // Clear any previous content
  section.innerHTML = '';

  // Loop through the requests array and create a card for each request
  for (let i = 0; i < requests.length; i++) {
    // Create the card container
    let card = document.createElement('div');
    card.classList.add('card', 'mb-3', 'justify-content-between', 'd-flex');
    card.style.maxwidth = 'max-content';
    card.style.maxheight = 'max-content';

    // Create the card body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'd-flex', 'justify-content-between', 'align-items-center');

    // Create the profile picture and add it to the card
    let profilePic = document.createElement('img');
    profilePic.classList.add('rounded', 'float-right', 'me-1');
    profilePic.style.width = '75px';
    profilePic.style.height = '70px';
    // profilePic.style.objectFit = 'center-center';
    profilePic.src = requests[i].image;

    // Create the card title with the friend's name
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title', 'me-1', 'justify-content-center');
    cardTitle.textContent = requests[i].name;

    // Create the accept button
    let acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.classList.add('btn', 'btn-success', 'btn-sm', 'float');
    acceptButton.textContent = 'Accept';
    acceptButton.style.maxwidth = 'max-content';
    acceptButton.style.maxheight = 'max-content';

    acceptButton.addEventListener('click', function () {
      // Handle accept button click
    });

    // Create the reject button
    let rejectButton = document.createElement('button');
    rejectButton.type = 'button';
    rejectButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float');
    rejectButton.textContent = 'Decline';
    rejectButton.style.maxwidth = 'max-content';
    rejectButton.style.maxheight = 'max-content';

    rejectButton.addEventListener('click', function () {
      // Handle reject button click
    });

    cardBody.appendChild(profilePic);
    cardBody.appendChild(cardTitle);

    // buttonBody.appendChild(acceptButton);
    // buttonBody.appendChild(rejectButton);
    // cardBody.appendChild(buttonBody);

    // Add the card body to the card container
    card.appendChild(cardBody);
    card.appendChild(acceptButton);
    card.appendChild(rejectButton);

    // Add the card to the section
    section.appendChild(card);
  }
}
