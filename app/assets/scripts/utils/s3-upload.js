'use strict';

export const getSignedUrl = (filename, token) => {
  return fetch(`https://api.openaq-staging.org/v1/upload?filename=${filename}&token=${token}`)
    .then((response) => response.json())
    .then((s3Data) => s3Data);
};
