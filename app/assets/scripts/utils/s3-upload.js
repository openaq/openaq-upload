'use strict';
import fetch from 'isomorphic-fetch';

export const getSignedUrl = (filename, token) => {
  return fetch(`https://api.openaq-staging.org/v1/upload?filename=${filename}&token=${token}&t=${new Date().getTime()}`)
    .then((response) => response.json())
    .then((s3Data) => s3Data);
};
