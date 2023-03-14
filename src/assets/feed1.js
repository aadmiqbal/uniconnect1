let bio = 'my name is axel';
let name = 'axel';
let imagesrc = '../../content/images/punpuntriangle.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

import { Client } from 'pg';

async function getConnection() {
  const client = new Client({
    user: 'teamproject',
    host: 'localhost',
    database: 'teamproject',
    password: '',
    port: 8080,
  });
  await client.connect();
  console.log('connected');
  return client;
}
function getUserModules(UserId, studyYear, subjectId, con) {
  let modules = [];
  try {
    let statement = 'SELECT id, moduleName FROM UserModules WHERE studyYear = $1 AND optional = False'; //AND subject = $2
    let values = [studyYear]; //, subjectId
    con.query(statement, values).then(res => modules.push([res.rows[0], res.rows[0]]));

    statement =
      'SELECT UserModules.id, UserModules.moduleName FROM UserModules INNER JOIN ModuleLink ON UserModules.id = ModuleLink.moduleId WHERE ModuleLink.userId = $1 AND UserModules.studyYear = $2'; //TODO: check links
    values = [UserId, studyYear];
    con.query(statement, values).then(res => modules.push([res.rows[0], res.rows[0]]));
  } catch {}
  return modules;
}

/*function filterModules(userModules, filters) {
  if (!Arrays.asList(filters).contains("All modules")) {
    Iterator itr = userModules.iterator();
    while (itr.hasNext()) {
      String[] module = (String[]) itr.next();
      if (!Arrays.asList(filters).contains(module[1])) itr.remove();
    }
  }
  return userModules;
}**/

function getPotentialConnections(modules, userId, studyYear, con) {
  let connections = [];
  try {
    let modulesString = '';
    modules.forEach(function addModuleToString() {
      modulesString += ', ' + module[0];
    });
    let statement =
      'SELECT AppUsers.id FROM AppUsers INNER JOIN ModuleLink ON AppUsers.id = ModuleLink.userId WHERE ModuleLink.moduleId IN ($1);';
    let values = [modulesString];
    con.query(statement, values).then(res => connections.push(res.rows[0]));
  } catch {}
  return connections;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function shuffleArray(ar) {
  for (let i = ar.length - 1; i > 0; i--) {
    let index = randomInt(0, i + 1);
    a = ar[index];
    ar[index] = ar[i];
    ar[i] = a;
  }
  return ar;
}

function getConnectionsDetails(connections, con) {
  let connectionDetails = new Array(connections.length);
  for (let i = 0; i < connections.length; i++) connectionDetails.push(new Array(5));
  try {
    let statement = 'SELECT name, studyYear, pfp FROM AppUsers WHERE id = $1;';
    for (let i = 0; i < connections.length; i++) {
      let values = [connections[i]];
      connectionDetails[i][0] = connections[i];
      con
        .query(statement, values)
        .then(res => (connectionDetails[i][1] = res.rows[1]))
        .then(res => (connectionDetails[i][2] = res.rows[2]))
        .then(res => (connectionDetails[i][3] = res.rows[3]));
    }
  } catch {}
  return connectionDetails;
}

function displayFeedBackend(n, filters, UserId) {
  let connectionsDetails = [];
  try {
    const con = getConnection();
    let statement = 'SELECT studyYear, subject FROM AppUsers WHERE id = $1'; //subject link doesn't exist?
    let values = [UserId];
    let studyYear,
      subjectId = 0;
    con
      .query(statement, values)
      .then(res => (studyYear = res.rows[0]))
      .then(res => (subjectId = res.rows[1]));

    let userModules = getUserModules(UserId, studyYear, subjectId, con);
    //userModules = filterModules(userModules, filters);

    let potentialConnections = shuffleArray(getPotentialConnections(userModules, UserId, studyYear, con));
    potentialConnections = potentialConnections.slice(n);

    connectionsDetails = getConnectionsDetails(potentialConnections, con);

    con.close();
  } catch {}
  return connectionsDetails;
}

async function greet() {
  await sleep(2000);
  let i = 1;
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
  cardTitle.textContent = name;

  let btnClose = document.createElement('button');
  btnClose.type = 'button';
  btnClose.className = 'btn-close float-end';
  btnClose.setAttribute('aria-label', 'Close');
  btnClose.dataset.target = '#' + i + 'cardsection';
  btnClose.dataset.dismiss = 'alert';

  let cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.textContent = 'Axel';

  let cardText = document.createElement('p');
  cardText.className = 'card-text';
  cardText.textContent = bio;
  let small = document.createElement('small');
  small.className = 'text-muted';
  small.textContent = 'Last updated 3 mins ago';

  let command = 'SELECT name FROM AppUsers;';
  let result = 'Adam';

  cardTitle.textContent = result;

  cardBody.appendChild(btnClose);
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
