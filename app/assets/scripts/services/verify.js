
import uploadSchema from '../schemas/upload-schema.json';
import attributionSchema from '../schemas/attribution-schema.json';

import validator from 'jsonschema';
import fileReaderStream from 'filereader-stream';

import csv from 'csv-parser'


export const failureType = {
    0: {
        code: 0, 
        text: 'It looks like there was an error parsing the file you uploaded. Please make sure you have a valid CSV file.', 
    },
    1: {
        code: 1,
        text: 'It looks like there are no rows of data in your dataset, or we are unable to parse your data.'
    },
    2: {
        code: 2,
        text: 'It looks like you are missing one or more of the required headers (columns). See full details below.',
        details: false
    },
    3: {
        code: 3,
        text: `There is an issue adding additional attributions with "attribution_name_<number>" and "attribution_url_<number>"`,
        details: false
    },
    4: {
        code: 4,
        text: "There was an error with the format of one or more rows of data. View details below",
        details: false
    }
}

function checkHeader(header) {
    const required = [
        'location', 'country', 'parameter', 'unit', 'value', 'date_utc', 'date_local'
        , 'sourceName', 'sourceType', 'mobile', 'coordinates_latitude', 'coordinates_longitude'
        ,'averagingPeriod_value','averagingPeriod_unit','attribution_name','attribution_url']
    let failures = [];
    required.forEach((prop) => {
        if (!(prop in header)) {
            failures.push({
                ...failureType[2],
                details: `Dataset is missing "${prop}" column.`
            });
        } 
    });
    return failures
}

function writeCsv(records) {
    const header = Object.keys(records[0]);
    let csv = records.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','));
    csv.unshift(header.join(','));
    return csv.join('\r\n');
}

export function parseCsv(csvFile) {
    return new Promise((resolve, reject) => {

        let records = [];
        let failures = [];
        let line = 0;

        fileReaderStream(csvFile).pipe(csv())
            .on('error', (failure) => {
                failures.push(failureType[0]);
                reject({
                    failures: failures,
                })
            })
            .on('data', (data) => {
                // Check for data;
                if (!data || data === {}) {
                    failures.push(failureType[1]);
                    reject({
                        failures: failures
                    })
                }
                if (line === 0 && !failures.length) {
                    // Check header on first line
                    failures = checkHeader(data);
                    if (failures.length) {
                        reject({
                            failures: failures
                        })
                    }
                }

                let record = {};
                if (!failures.length) {
                    Object.keys(data).forEach((key) => {
                        let value = data[key];
                        if (!isNaN(value)) {
                            value = Number(value);
                        }
                        record[key] = value
                    })
                }
                
                try {
                    // look for additional attribution columns. 
                    const rowKeys = Object.keys(record);
                    let searchingAttributions = true;
                    let attributionIndex = 2;
                    if ('attribution_name_1' in rowKeys || 'attribution_url_1' in rowKeys) {
                        failures.push({
                            ...failureType[3],
                            details: `Additional attributions start at "attribution_name_2" and "attribution_url_2"`
                        })
                        reject({failures})
                    } 
                    while(searchingAttributions) {
                        if (`attribution_name_${attributionIndex}` in rowKeys) {
                            console.log(`found attribution ${attributionIndex}`)
                            if (`attribution_url_${attributionIndex}` in rowKeys) {
                                console.log('found attributions', attributionIndex)
                                continue
                            } 
                            failures.push({
                                ...failureType[3],
                                details: `Record ${line}: found "attribution_name_${attributionIndex}", but not "attribution_url_${attributionIndex}"`
                            })
                        } else if (`attribution_url_${attributionIndex}` in rowKeys) {
                            failures.push({
                                ...failureType[3],
                                details: `Record ${line}: found "attribution_url_${attributionIndex}", but not "attribution_name_${attributionIndex}"`
                            })
                        }
                        searchingAttributions = false
                    }
                } catch (e) {
                    failures.push({
                        ...failureType[3],
                        details: `Record ${line}: Error parsing additional "attribution_name" and "attribution_url" columns.`
                    })
                }

                if (!failures.length) {
                    let v = validator.validate(record, uploadSchema);
                    v.errors.forEach((e) => {
                        console.log(e)
                        failures.push({
                            ...failureType[4],
                            details: `Record ${line}: ${e.property.replace('instance.', '')} ${e.message}`
                        });
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
                    failures: failures
                })
            });
    })
}