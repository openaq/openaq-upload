'use strict';
import fetch from 'isomorphic-fetch';
import config from '../config';

export const getSignedUrl = (filename, token) => {
  return fetch(`${config.api}?filename=${filename}&token=${token}&t=${new Date().getTime()}`)
    .then((response) => response.json())
    .then((s3Data) => s3Data);
};
