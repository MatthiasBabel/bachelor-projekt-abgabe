var five = require("johnny-five");
var board = new five.Board();
var express = require('express');
var cors = require('cors');
var fs = require('fs');

var app = express();
app.use(cors());

// opens express listener
app.listen(8082, function () {
  console.log('App listening on port 8082!');
});

// sets http post listen
app.get("/button", (req, res) => {
  res.send("on");
});


board.on("ready", function() {
  var led = new five.Led(2);
  var button = new five.Button({
  pin: 3,
  invert: false
} );

  this.repl.inject({
    led: led
  });
  board.repl.inject({
    button: button
  });


  led.blink();

  button.on("hold", function() {
    console.log( "Button held" );
    app.get("/button", (req, res) => {
      res.send("on");
    });
  });

  button.on("press", function() {
    console.log( "Button pressed" );
    app.get("/button", (req, res) => {
      res.send("on");
    });
    led.stop();
    led.toggle();
  });

  button.on("release", function() {
    console.log( "Button released" );
    app.get("/button", (req, res) => {
      res.send("on");
    });
  });

  // This will grant access to the led instance
  // from within the REPL that's created when
  // running this program.

});
