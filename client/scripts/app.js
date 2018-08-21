// YOUR CODE HERE:
var username = window.location.search.slice(10);
username = username.split("%20").join(" ");
var currentUsername;

var CreateMessage = function(username, text, roomname) {
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

var app = {};
var fetchedData;
var roomname = null;

app.init = function() {
  $(document).ready(function() {
    // var $feed = $(".feed");
    app.fetch();

    $("#input-box").on("keypress", function(key) {
      if (key.which === 13) {
        app.submit();
        $(this).val("");
      }
    });

    $("#submit-button").click(function(e) {
      e.preventDefault();
      app.submit();
    });

    $(".hrla24").click(function(e) {
      e.preventDefault();
      roomname = "hrla24";
    });

    $(".random").click(function(e) {
      e.preventDefault();
      roomname = "random";
    });

    $(".code-talk").click(function(e) {
      e.preventDefault();
      roomname = "code-talk";
    });

    $(".jokes").click(function(e) {
      e.preventDefault();
      roomname = "jokes";
    });

    $(".lobby").click(function(e) {
      e.preventDefault();
      roomname = null;
    });

    $(`.feed`).on("click", ".username", function(event) {
      let currentUser = event.currentTarget.textContent;
      currentUser = `.${currentUser}`;
      console.log(currentUser);
      $(currentUser).css("font-weight", "bold");
    });

    setInterval(function() {
      app.fetch();
    }, 2000);
  });
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: `http://127.0.0.1:3000/classes/messages`,
    type: "POST",
    data: JSON.stringify(message),
    contentType: "application/json",
    success: function(data) {
      app.fetch();
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error("chatterbox: Failed to send message", data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: `http://127.0.0.1:3000/classes/messages`,
    type: "GET",
    data: "order=-createdAt",
    contentType: "application/json",
    success: function(data) {
      app.renderMessage(data);
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error("chatterbox: Failed to retrieve data", data);
    }
  });
};

app.clearMessages = function() {
  // document.removeChild($(".messages"));
};

app.renderMessage = function(messages) {
  // var newRooms = [];
  $(".feed").html("");
  for (let i = 0; i < messages.results.length; i++) {
    if (roomname === null) {
      let $message = new CreateMessage(
        messages.results[i].username,
        messages.results[i].text,
        messages.results[i].roomname
      );
      $(`<div>
            <div class="username ${$message.username}">${$message.username ||
        "anonymous"}</div> 
            <div>${$message.text || ""} (${$message.roomname || "lobby"})</div>
        </div>
      <hr></hr>`).appendTo($(".feed"));
    } else if (messages.results[i].roomname === roomname) {
      let $message = new CreateMessage(
        messages.results[i].username,
        messages.results[i].text,
        messages.results[i].roomname
      );
      $(`<div>
            <div class="username ${$message.username}">${$message.username ||
        "anonymous"}</div> 
            <div>${$message.text || ""} (${$message.roomname || "lobby"})</div>
        </div>
      <hr></hr>`).appendTo($(".feed"));
    }
  }
};
app.submit = function() {
  let text = $(".form-control").val();
  let currRoomname = roomname;
  let newMessage = new CreateMessage(username, text, currRoomname);
  app.send(newMessage);
};

app.renderRoom = function() {};

app.init();
