//Install express server
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Initialize the app.
const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});
