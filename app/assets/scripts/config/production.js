'use strict';

export default {
  environment: 'production',
  gist: {
    sampleCSV: 'https://gist.githubusercontent.com/dqgorelick/2812154e78816b7246fd3ee336048232/raw/5e48bc60b76c1f60dd89e91959ada6e630fa7719/openaq_upload_tool_sample_csv.csv',
    templateCSV: 'https://gist.githubusercontent.com/dqgorelick/07104a91fc92705f6e5f67d75de8d3fc/raw/aa5f39137bb366b9f423bdfc8f7de91f91ef5fbb/openaq_upload_tool_csv_template.csv',
    formatId: 'c98a8721d2ec59d6242d714018e2a0e7'
  },
  uploadUrl: 'https://msvubagbu9.execute-api.us-west-2.amazonaws.com/dev/api/private',
  apiUrl: 'https://api.openaq.org',
  auth: {
    domain: 'openaq-prod.auth0.com',
    clientID: 'Ga5GtzRl3T72RP35z0m6SpHy87iJEWLs',
    callbackUrl: 'https://upload.openaq.org/callback',
    audience: 'https://openaq-prod.auth0.com/api/v2/'
  }
};
