function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function greet() {
  await sleep(5000);
  console.log('working2');
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
  img.src = '../../content/images/punpuntriangle.png';
  img.className = 'img-fluid rounded-start rounded';
  img.alt = 'Profile';

  colMd4.appendChild(img);

  let colMd8 = document.createElement('div');
  colMd8.className = 'col-md-8';

  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  let btnClose = document.createElement('button');
  btnClose.type = 'button';
  btnClose.className = 'btn-close float-end';
  btnClose.setAttribute('aria-label', 'Close');
  btnClose.dataset.target = '#' + i + 'cardsection';
  btnClose.dataset.dismiss = 'alert';

  let cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.textContent = 'Placeholder Name';

  let cardText = document.createElement('p');
  cardText.className = 'card-text';
  cardText.textContent =
    'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita adipisci vero tempora! Laudantium voluptatibus praesentium itaque alias possimus quia, vel dolorem reprehenderit quae, incidunt sunt tenetur libero nihil officia nulla!';

  let small = document.createElement('small');
  small.className = 'text-muted';
  small.textContent = 'Last updated 3 mins ago';

  cardBody.appendChild(btnClose);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(small);

  colMd8.appendChild(cardBody);

  row.appendChild(colMd4);
  row.appendChild(colMd8);

  myPanel.appendChild(row);

  document.getElementById('cardsection').appendChild(myPanel);

  i++;
}
