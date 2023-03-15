let imagesrc = '../../content/images/punpuntriangle.png';

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
    cardTitle.textContent = user.name;

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
    cardText.textContent = user.bio;
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
