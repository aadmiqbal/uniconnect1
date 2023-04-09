let imagesrc = '../../content/images/pp.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function greet(appUsers) {
  await sleep(2000);

  /*let head = document.getElementsByTagName('HEAD')[0];
  let cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';
  cssLink.href = 'connections-feed.component.scss';
  head.appendChild(cssLink);*/

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
    alert('Huaghefhiwegyugysef!');
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

  const connect = function () {
    alert("'Connect' pushed!");
  }; //TODO: call backend to add connection
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
