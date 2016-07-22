$(document).ready(function() {
  /* running before user action*/
  $('.container').hide();
  //fetch data
  fetchData();

  //hide stuff before everything
  $("#seek-box").hide();
  $("#input-area").hide();
  $("#saved-text").hide();
  $("#saved-area").hide();
  $("#seek-box").click(function() {
    //put data into html
    populate();
    //show stuff
    $('.container').show();
    $("#seek-box").hide();
  });

});

//put data in here
var mongoData;
var dataCount = 0;
var dataDate;

//rotating cube state
var state = 0;
var cubeRotateAry = ['show-front', 'show-back', 'show-right', 'show-left', 'show-top', 'show-bottom'];
var sideAry = ['back', 'right', 'left', 'top', 'bottom', 'front'];

//ajax get news data function
var populate = function() {
  // jQuery AJAX call for JSON
  $.getJSON('/check', function(data) {
    mongoData = data;
    dataDate = mongoData[mongoData.length - 1].date;
    // For each item in our JSON, add a table row and cells to the content string
  }).done(function() {
    // running clickBox functions
    clickBox();
    saveNote();
  });
};

//ajax get notes data
var gather = function() {
  var idCount = dataCount - 1;

  // jQuery AJAX call for JSON
  $.ajax({
    type: "POST",
    dataType: "json",
    url: '/gather',
    data: {
      id: mongoData[idCount]._id
    }
  })
  .done(function(currentNotes) {
    postNote(currentNotes);
  })
  .fail(function() {
    console.log("Sorry. Server unavailable.");
  });
};

//render notes from data
var postNote = function(currentNotes) {
  $("#note-box").val("");

  var note = "";
  for (var i = 0; i < currentNotes.length; i++) {
    note = note + currentNotes[i].noteText + '\n';
  }

  $("#note-box").val(note);
};

//function containing listener to save notes and clear note taking area
var saveNote = function() {
  $("#note-button").on('click', function() {
    var text = $("#input-box").val();
    var idCount = dataCount - 1;

    $.ajax({
      type: "POST",
      dataType: "json",
      url: '/save',
      data: {
        id: mongoData[idCount]._id,
        date: dataDate,
        note: text
      }
    })
    .done(function() {
      $("#input-box").val("");
      // grab the notes again because we just saved a new note
      gather();
    })
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};

//function containing listener to delete notes and clear note taking area
var deleteNote = function() {
  $("#delete-button").on('click', function() {
    var idCount = dataCount - 1;

    $.ajax({
      type: "DELETE",
      dataType: "json",
      url: '/delete',
      data: {
        id: mongoData[idCount]._id,
      }
    })
    .done(function() {
      $("#note-box").val("");
    })
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};

//type animation function
var typeIt = function() {
  $("#typewriter-headline").remove();
  $("#typewriter-summary").remove();
  var h = 0;
  var s = 0;
  var newsText;

  if (state > 0) {
    side = state - 1;
  } else {
    side = 5;
  }

  $("." + sideAry[side]).append("<div id='typewriter-headline'></div>");
  $("." + sideAry[side]).append("<div id='typewriter-summary'></div>");

  //cycle to different story
  console.log(mongoData);
  var headline = mongoData[dataCount].headline;
  var summary = mongoData[dataCount].summary;
  dataCount++;
  // type animation for new summary
  (function type() {
    //console.log(newsText);
    printHeadline = headline.slice(0, ++h);
    printSummary = summary.slice(0, ++s);


    //put in the text via javascript
    $("#typewriter-headline").text(printHeadline);
    $("#typewriter-summary").text(printSummary);

    //return stop when text is equal to the writeTxt
    if (printHeadline.length === headline.length && printSummary.length === summary.length) {
      return;
    }
    setTimeout(type, 35);
  }());
};

//render headline
var headline = function() {
  var show = "|| Article:" + (dataCount + 1) + " ||";
  $("#headline").text(show);
  $("#headline").fadeIn()
    .css({
      position: 'relative',
      'text-align':'center',
      top:100
    })
    .animate({
      position:'relative',
      top: 0
    });
};

//add click event function
var clickBox = function() {
  $("#cube").on("click", function() {
    //rotate cycle
    if (state <= 5) {
      state++;
    } else {
      state = 0;
    }
    $('#cube').removeClass().addClass(cubeRotateAry[state]);

    //animate headline
    headline();
    //animate text
    typeIt();
    //render notes
    gather();
    //enable delete click listener
    deleteNote();

    //show the note boxes
    $("#input-area").show();
    $("#saved-area").show();
  });
};

// ajax call to do the scrape
var fetchData = function() {
  $.ajax({
    type: "POST",
    url: '/fetch'
  }).done(function() {
    $("#seek-box").show();
  }).fail(function() {
    alert("Sorry. Server unavailable.");
  });
};