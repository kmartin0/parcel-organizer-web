//Install express server
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
app.use(express.static(__dirname + '/dist/parcel-organizer-web'));

// Pass our application into our routes.
app.get('*', function (req, res) {
  res.sendfile(path.join(__dirname + '/dist/parcel-organizer-web/index.html')); // load our index.html file
});

// Initialize the app.
const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});
