
import uploadSchema from '../schemas/upload-schema.json';

import validator from 'jsonschema';
import fileReaderStream from 'filereader-stream';

import csv from 'csv-parser'

export const failureTypes = {
    0: 'It looks like there was an error parsing the file you uploaded. Please make sure you have a valid CSV file.',
    1: 'It looks like you are missing one or more of the required headers (columns). See full details below.',
    2: 'It looks like you have an error in one or more of your rows of data. See the full output below.'
}

function checkHeader(header) {
    const required = [
        'location', 'country', 'parameter', 'unit', 'value', 'date_utc', 'date_local'
        , 'sourceName', 'sourceType', 'mobile', 'coordinates_latitude', 'coordinates_longitude'
        , 'attribution_name','attribution_url','averagingPeriod_value','averagingPeriod_unit']
    let failures = [];
    console.log(header)
    required.forEach((prop) => {
        if (!(prop in header)) failures.push(`Dataset is missing "${prop}" column.`);
    });
    return failures;
}

function writeCsv(records) {
    const header = Object.keys(records[0]);
    let csv = records.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','));
    csv.unshift(header.join(','));
    return csv.join('\r\n');
}

export function parseCsv(csvFile) {
    return new Promise((resolve, reject) => {
        // const csvStream = csv.createStream();
        let records = [];
        let failures = [];
        let line = 0;

        fileReaderStream(csvFile).pipe(csv())
            .on('error', (failure) => {
                failures.push(failure);
                reject({
                    failures: failures,
                    failureType: 0
                })
            })
            .on('data', (data) => {
                // Check for data;
                if (!data || data === {}) {
                    failures = ['No data provided'];
                    reject({
                        failures: failures,
                        failureType: 0
                    })
                }
                if (line === 0 && !failures.length) {
                    // Check header on first line
                    failures = failures.concat(checkHeader(data));
                    if (failures.length) {
                        reject({
                            failures: failures,
                            failureType: 1
                        })
                    }
                }

                if (!failures.length) {
                    let record = {};
                    Object.keys(data).forEach((key) => {
                        let value = data[key];
                        if (!isNaN(value)) {
                            value = Number(value);
                        }
                        record[key] = value
                    })


                    let v = validator.validate(record, uploadSchema);
                    v.errors.forEach((e) => {
                        failures.push(`Record ${line}: ${e.property.replace('instance.', '')} (${e.instance}) ${e.message}`);
                    });
                    records.push(record)
                    line++;
                }
            })
            .on('end', () => {
                if (!failures.length) {
                    // If no failures, convert record array to CSV
                    resolve({
                        failures: failures,
                        csvOutput: writeCsv(records)
                    })
                }
                reject({
                    failures: failures,
                    failureType: 2
                })
            });
    })
}