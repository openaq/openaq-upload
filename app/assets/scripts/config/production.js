'use strict';

export default {
  environment: 'production',
  gist: 'c98a8721d2ec59d6242d714018e2a0e7',
  uploadUrl: 'https://h4m649k77h.execute-api.us-east-1.amazonaws.com/production/api/private',
  apiUrl: 'https://api.openaq.org',
  bucketName: 'upload-tool-bucket-production',
  auth: {
    domain: 'openaq-prod.auth0.com',
    clientID: 'Ga5GtzRl3T72RP35z0m6SpHy87iJEWLs',
    callbackUrl: 'https://upload.openaq.org/callback',
    audience: 'https://openaq-prod.auth0.com/api/v2/'
  }
};
