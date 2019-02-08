var express = require('express');
var cors = require('cors');
var fs = require('fs');

var app = express();
app.use(cors())



  // opens express listener
app.listen(8080, function () {
  console.log('App listening on port 8080!');
});

  // sets http post listen
app.get("/contract", (req, res) => {
  getContract().then(result => { res.send(result) })
});

var getContract = function() {
    return new Promise((resolve, reject) => {
      resolve(
        fs.readFileSync(
          __dirname + "/build/contracts/Energy.json"
        )
      );
    });
};
