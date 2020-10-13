import fetch from 'unfetch';
import qs from 'query-string';

import { apiUrl, uploadUrl } from '../config';
import auth from './auth';

function request(method, url, params = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.getAccessToken()}`
  };

  const options = {
    headers,
    method
  };

  let query = '';
  if (
    method === 'POST' ||
    method === 'PUT' ||
    method === 'DELETE'
  ) {
    options.body = JSON.stringify(params);
  } else {
    query = qs.stringify(params, { arrayFormat: 'bracket' });
  }

  const fullUrl = `${url}?${query}`;
  return fetch(fullUrl, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res
    })
    .then(res => res.json())
    .catch(error => {
      return {
        message: `${error}`,
        error: true
      }
    })
}

function getTotalMeasurements() {
  return request('GET', `${apiUrl}/v1/measurements`, { limit: 0 })
}

function putUploadToolData(data) {
  return request('POST', uploadUrl, {
    data: data.csvFile,
    profile: data.profile
  })
}

export default {
  putUploadToolData,
  getTotalMeasurements
};
