'use strict';

export const s3Upload = function (file) {
  return fetch(`http://localhost:5000/s3_credentials?filename=${file.name}`, {
    method: 'GET',
    // Removed for local testing
    headers: {
      // 'Accept': 'application/csv',
      // 'Content-Type': 'application/csv'
    }
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (s3Data) {
    const params = s3Data.params;
    // Instantiate an empty form
    let data = new FormData();

    // Populate the form paramters
    data.append('acl', params.acl);
    data.append('key', params.key);
    data.append('policy', params.policy);
    data.append('success_action_status', params['success_action_status']);
    data.append('x-amz-algorithm', params['x-amz-algorithm']);
    data.append('x-amz-credential', params['x-amz-credential']);
    data.append('x-amz-date', params['x-amz-date']);
    data.append('x-amz-signature', params['x-amz-signature']);
    data.append('file', file);

    // Send the file
    return fetch(s3Data.endpoint_url, {
      method: 'POST',
      body: data
    })
    .then(function (response) {
      return response;
    });
  }).catch(function (err) {
    return err;
  });
};
