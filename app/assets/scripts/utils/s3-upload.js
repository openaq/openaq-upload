'use strict';

export const getSignedUrl = function (filename, token) {
  return fetch(`https://api.openaq-staging.org/v1/upload?filename=${filename}&token=${token}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (s3Data) {
      return s3Data;
    });
};
