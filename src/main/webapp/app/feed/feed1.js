//idea is probably going to be to have an array or list of profiles taken
// from db where modules match any the user has (or has specified they are searching
// for in profile creation) and create a card for each based on that. For now this just
// loads stuff with placeholder info.

//friend request stuff just there but doesn't need to be done for mvp

//holds the amount of profiles that have been added to a page in a session
var i = 1;

//holds number of friend requests
var fr = 0;

//function that adds cards to the cardSection of html file
var addCols = function (num) {
  for (var j = 1; j <= num; j++) {
    addCard();
  }

  //closes the card when the 'x' button is clicked
  $('.btn-close').on('click', function (e) {
    e.stopPropagation();
    var $target = $(this).closest('.card');
    $target.hide('slow', function () {
      $target.remove();
    });
    //will try to find a better looking transition but ones i tried didn't work
  });
};

//function that adds cards to the friendrequests section of html file
var addfrs = function (num) {
  for (var j = 1; j <= num; j++) {
    addFriendReqCard();
  }

  //closes the card when the 'x' button is clicked
  $('.btn-close').on('click', function (e) {
    e.stopPropagation();
    var $target = $(this).closest('.card');
    $target.hide('slow', function () {
      $target.remove();
    });
    //will try to find a better looking transition but ones i tried didn't work
  });
};

//adds 10 profiles to feed when the page is opened
//adds 3 profiles to friend request section
$(document).ready(function () {
  var num = 10;
  addCols(num);
  addfrs(3);
});

//adds 10 more profiles to feed when you scroll to a certain point with 30 being the max amount
jQuery(function ($) {
  $('#flux').bind('scroll', function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight && i < 30) {
      addCols(10);
    }
  });
});

//can replace placeholder info with arguments for the following functions

function addCard() {
  var myPanel = $(`<div class="card mb-3" style="max-width: max-content;" id="${i}cardsection">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="punpuntriangle.png" class="img-fluid rounded-start rounded" alt="Profile">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <button type="button" class="btn-close float-end" aria-label="Close" data-target="#${i}cardsection" data-dismiss="alert"></button>
              <h5 class="card-title">Placeholder Name</h5>
              <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita adipisci vero tempora! Laudantium voluptatibus praesentium itaque alias possimus quia, vel dolorem reprehenderit quae, incidunt sunt tenetur libero nihil officia nulla!</p>
              <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            </div>
          </div>
        </div>
      </div>`);
  myPanel.appendTo('#cardsection');
  i++;
}

//need to add an accept button
function addFriendReqCard() {
  var myPanel = $(`<div class="card mb-3" style="max-width: max-content;" id="${fr}requestsection">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="punpuntriangle.png" class="img-fluid rounded-start rounded" alt="Profile">
          </div>
          <div class="col-md-8">
            <div class="card-body">

              <button type="button" class="btn-close float-end" aria-label="Close" data-target="#${fr}requestsection" data-dismiss="alert"></button>

              <h5 class="card-title">Placeholder Name</h5>
            </div>
          </div>
        </div>
      </div>`);
  myPanel.appendTo('#requestsection');
}
