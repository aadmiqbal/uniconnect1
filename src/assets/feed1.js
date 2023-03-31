let imagesrc = '../../content/images/pp.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function greet(appUsers) {
  await sleep(2000);
  let i = 1;

  // loop through appUsers
  for (const user of appUsers) {
    let myPanel = document.createElement('div');
    myPanel.className = 'card mb-3';
    myPanel.style.maxWidth = 'max-content';
    myPanel.id = i + 'cardsection';

    let row = document.createElement('div');
    row.className = 'row g-0';

    let colMd4 = document.createElement('div');
    colMd4.className = 'col-md-4';

    let img = document.createElement('img');
    img.src = imagesrc;
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
    cardText.textContent = 'Biography:' + ' ' + user.bio;
    cardText.title = 'Year Of Study' + ' ' + user.studyYear;
    let small = document.createElement('small');
    small.className = 'text-muted';
    small.textContent = 'Last updated 3 mins ago';

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(btnClose);
    cardBody.appendChild(cardText);
    cardBody.appendChild(small);

    colMd8.appendChild(cardBody);

    row.appendChild(colMd4);
    row.appendChild(colMd8);

    myPanel.appendChild(row);

    document.getElementById('cardsection').appendChild(myPanel);

    i++;
  }
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

    let chatButton = document.createElement('button');
    chatButton.textContent = 'Chat';

    // Add the title and text to the card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    // Add the card body to the card container
    card.appendChild(cardBody);
    card.appendChild(chatButton);

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

// Function to accept a request
function acceptRequest(request) {
  // Your code to accept the request goes here
}

// Function to reject a request
function rejectRequest(request) {
  // Your code to reject the request goes here
}
