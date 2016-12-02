var express = require('express');
var crypto = require('crypto');
var path = require('path');

var s3 = require('./s3');

var s3Config = {
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION
};

var app = express();

app.set('port', (process.env.PORT || 5000));
app.get('/s3_credentials', function (request, response) {
  // The following code allows for local access at the expense of security.
  // Do not use in production.
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Credentials', true);
  response.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  // End insecure code
  if (request.query.filename) {
    var filename =
      crypto.randomBytes(16).toString('hex') +
      path.extname(request.query.filename);
    response.json(s3.s3Credentials(s3Config, filename));
  } else {
    response.status(400).send('filename is required');
  }
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
