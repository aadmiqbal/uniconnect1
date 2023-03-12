//holds the amount of profiles that have been added to a page in a session
var i = 1;

//function that adds cards to the cardSection of html file
var addCols = function (num) {
  for (var j = 1; j <= num; j++) {
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

  //closes the card when the 'x' button is clicked
  $('.btn-close').on('click', function (e) {
    e.stopPropagation();
    var $target = $(this).closest('.card');
    $target.hide('slow', function () {
      $target.remove();
    });
    //want to find a better looking transition but ones I have tried didn't work
  });
};

//adds 10 profiles to feed when the page is opened
$(document).ready(function () {
  var num = 10;
  addCols(num);
});

//adds 10 more profiles to feed when you scroll to a certain point with 30 being the max amount
jQuery(function ($) {
  $('#flux').bind('scroll', function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight && i < 30) {
      addCols(10);
    }
  });
});
