'use strict';

export default {
  environment: 'development',
  apiUrl: 'https://api.openaq.org',
  uploadUrl: 'https://nl82bxd5di.execute-api.us-east-1.amazonaws.com/dev/api/private',
  gist: {
    sampleCSV: 'https://gist.githubusercontent.com/dqgorelick/2812154e78816b7246fd3ee336048232/raw/5e48bc60b76c1f60dd89e91959ada6e630fa7719/openaq_upload_tool_sample_csv.csv',
    templateCSV: 'https://gist.githubusercontent.com/dqgorelick/07104a91fc92705f6e5f67d75de8d3fc/raw/aa5f39137bb366b9f423bdfc8f7de91f91ef5fbb/openaq_upload_tool_csv_template.csv',
    formatId: 'c98a8721d2ec59d6242d714018e2a0e7'
  },
  bucketName: 'upload-tool-bucket-development',
  auth: {
    domain: 'dev-59haz2pg.auth0.com',
    clientID: '18Xb6jZ8il6wqjzI6eJwFW6NO4ey8j5i',
    callbackUrl: 'http://d8vr8088dbn3x.cloudfront.net/callback',
    audience: 'https://dev-59haz2pg.auth0.com/api/v2/'
  }
};
