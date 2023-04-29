async function displayFinalGroups(finalGroups) {
  await sleep(2000);

  // loop through finalGroups
  for (const group of finalGroups) {
    let i = 1;

    let imagesrc1 = '../../content/images/pp.png';
    if (group.pfp) {
      imagesrc1 = group.pfp;
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
    cardTitle.textContent = 'Group Name: ' + '  ' + group.name;

    let isAdvertised = document.createElement('p');
    isAdvertised.className = 'card-text';
    isAdvertised.textContent = 'Is Advertised: ' + group.isAdvertised;

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = 'Group Description: ' + group.groupDescription;
    cardText.title = 'Is Advertised: ' + group.isAdvertised;

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
    cardBody.appendChild(isAdvertised);
    cardBody.appendChild(cardText);

    //cardBody.addEventListener('click', showGroup.bind(cardBody, group));

    colMd8.appendChild(cardBody);

    row.appendChild(colMd4);
    row.appendChild(colMd8);
    myPanel.appendChild(row);

    document.getElementById('cardsection').appendChild(myPanel);

    i++;
  }
}
