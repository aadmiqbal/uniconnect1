var i = 1;
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
    myPanel.prependTo('#cardsection');
    i++;
  }

  $('.btn-close').on('click', function (e) {
    e.stopPropagation();
    var $target = $(this).closest('.card');
    $target.hide('slow', function () {
      $target.remove();
    });
    /*$target.animate({opacity: 0}, 500, function() {
        $target.remove();
    }); */
    /* $target.fadeOut(500, linear, function() {
         $target.remove();
     });        */
  });
};

$(document).ready(function () {
  var num = 10;
  addCols(num);
  /*   $('#cardsection').scroll(function() {
       if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
         addCols(num);
       }
     }); */
});
