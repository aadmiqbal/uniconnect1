async function displayFinalGroups(finalGroups) {
  // loop through finalGroups
  let currentUserId = 485468454;
  for (const group of finalGroups) {
    if (group.members.split(',').includes(currentUserId.toString()) || group.isAdvertised == false) {
      continue;
    }
    let i = 1;

    let imagesrc1 = '../../content/images/pp.png';
    /*if (group.pfp) {
      imagesrc1 = group.pfp;
    }*/

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
    cardTitle.textContent = 'Group Name: ' + '  ' + group.name;

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = 'Group Description: ' + group.groupDescription;

    let numberOfMembers = document.createElement('p');
    numberOfMembers.className = 'card-text text-muted';
    numberOfMembers.textContent = 'Number of Members: ' + group.members.split(',').length;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(numberOfMembers);

    let connectButton = document.createElement('button');
    connectButton.textContent = 'Connect';
    connectButton.style.border = 'None';
    connectButton.style.width = '100%';
    connectButton.classList.add('btn');
    connectButton.addEventListener('click', () => {
      connectToGroup(group.id, currentUserId);
    });

    cardBody.appendChild(connectButton);

    // Add the button to the card body
    cardBody.appendChild(connectButton);

    colMd8.appendChild(cardBody);

    row.appendChild(colMd4);
    row.appendChild(colMd8);
    myPanel.appendChild(row);

    document.getElementById('cardsection').appendChild(myPanel);

    i++;
  }
}

async function displayCurrentGroups(currentGroups, finalusers, currentUserId) {
  console.log('currentGroups in displayGroups:', currentGroups);
  console.log('function is actually called');

  // Fetch users data
  // const usersMap = await fetchUsersByIds(finalusers);

  // Get the section element where we want to display the cards
  let section = document.getElementById('list');

  // Clear any previous content
  section.innerHTML = '';

  // Loop through the groups array and create a card for each group where the current user is a member
  for (const group of currentGroups) {
    let members = group.members.split(',');
    if (!members.includes(currentUserId.toString())) {
      console.log('not a member of this group');
      continue;
    }
    console.log('member of this group');
    // Create the card container
    let card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Create the card body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create the card title with the group's name
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = group.name;

    // Create the profile picture and add it to the card
    let profilePic = document.createElement('img');
    profilePic.classList.add('rounded', 'float-end');
    profilePic.style.width = '75px';
    profilePic.style.height = '75px';
    profilePic.style.objectFit = 'cover';
    if (group.pfp) {
      profilePic.src = group.pfp;
    } else {
      profilePic.src = imagesrc;
    }
    cardBody.appendChild(profilePic);

    let settingsButton;
    if (group.admins.includes(currentUserId.toString())) {
      settingsButton = document.createElement('button');
      settingsButton.textContent = 'Settings';
      settingsButton.style.border = 'None';
      settingsButton.style.width = '100%';
      settingsButton.innerHTML = `<a href="/groupsettings/${group.id}" class="settings-btn">Go to Group Settings</a>`;

      card.appendChild(settingsButton);
    }

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
