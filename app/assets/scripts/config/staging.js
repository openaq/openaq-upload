'use strict';

export default {
  environment: 'development',
  apiUrl: 'https://api.openaq.org',
  uploadUrl: 'https://nl82bxd5di.execute-api.us-east-1.amazonaws.com/dev/api/private',
  gist: 'c98a8721d2ec59d6242d714018e2a0e7',
  bucketName: 'upload-tool-bucket-development',
  auth: {
    domain: 'dev-59haz2pg.auth0.com',
    clientID: '18Xb6jZ8il6wqjzI6eJwFW6NO4ey8j5i',
    callbackUrl: 'http://d8vr8088dbn3x.cloudfront.net/callback',
    audience: 'https://dev-59haz2pg.auth0.com/api/v2/'
  }
};
