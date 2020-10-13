'use strict';

import fileReaderStream from 'filereader-stream';
import validator from 'jsonschema';
import csv from 'csv-stream';
import measurementSchema from './measurement-schema';

const checkHeader = (header, failures) => {
  const required = [
    'parameter', 'unit', 'value', 'sourceName', 'sourceType',
    'date/utc', 'date/local', 'mobile', 'location', 'city', 'country'
  ];
  required.forEach((prop) => {
    if (!(prop in header)) failures.push(`Dataset is missing "${prop}" column.`);
  });
  if (failures.length) {
    return failures;
  }
};

export const csvParse = (csvData) => {
  const csvStream = csv.createStream({delimiter: ',', endLine: '\n'});
  let failures = [];
  let line = 0;
  fileReaderStream(csvData).pipe(csvStream)
    .on('error', (failure) => {
      let failures = [];
      failures.push(failure);
      return failures;
    })
    .on('data', (data) => {
      if (line === 0) checkHeader(data, failures);
      line++;
      if (!data || data === {}) {
        failures = {'no data provided': 1};
        return failures;
      }
      let record = {};
      Object.keys(data).forEach((key) => {
        let value = data[key];
        // Numeric strings should be converted to numbers
        if (!isNaN(value)) value = Number(value);
        // Sub-keys will be indicated by a slash
        const splitKey = key.split('/');
        // Treat values attached to primary keys differently than those with subkeys
        if (splitKey.length === 1) {
          // The "mobile" attribute should be converted to boolean
          if (key === 'mobile' && isNaN(value)) {
            if (value.toLowerCase() === 'true') {
              value = true;
            } else if (value.toLowerCase() === 'false') {
              value = false;
            }
          }
          // Save value to record
          record[key] = value;
        // Treat values attached to subkeys differently than those attached to primary keys
        } else {
          const [key, subkey] = splitKey;
          // Treat attribution differently, as it is an array of name/url pairs
          if (key === 'attribution') {
            if (subkey === 'name' && isNaN(value)) {
              // Attribution arrays will be separated by a space-padded pipe character (|) in the csv.
              // URL order and number must match name order and number (if a URL isn't paired
              // with a name, the user will still need to provide a separator to skip it).
              // This is hard to represent in csv; we may be able to find a better way.
              const urls = data['attribution/url'].split('|');
              value = value.split('|').map((name, i) => {
                return {name: name, url: urls[i]};
              });
              record[key] = value;
            }
          } else {
            // Add subkeys, if applicable
            if (key === 'date' && !record['date']) record['date'] = {};
            if (key === 'averagingPeriod' && !record['averagingPeriod']) record['averagingPeriod'] = {};
            if (key === 'coordinates' && !record['coordinates']) record['coordinates'] = {};
            // Dates are not a valid JSON type, so enforcing a particular format would be subjective.
            // We may change the schema to a regex string validator.
            if (key === 'date' && subkey === 'utc' && isNaN(value)) {
              value = new Date(value);
            }
            // Save value to record
            record[key][subkey] = value;
          }
        }
      });
      // Perform validation of the compiled object against the JSON schema file
      let v = validator.validate(record, measurementSchema);
      v.errors.forEach((e) => {
        failures.push(`record ${line} ${e.stack}`);
      });
    })
    .on('end', () => {
      console.log('Inside the parse itself, the failures are succesfully compiled: ', failures);
      return failures;
    });
};