'use strict';
var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  consoleMessage: logo,
  api: 'https://api.openaq-staging.org/v1',
  apiDocs: 'https://docs.openaq.org'
};
