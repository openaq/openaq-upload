const uploadSchema = require('../schemas/upload-schema.json');

const validator = require('jsonschema');
const csv = require('csv-parser');
const failureType = require('../constants');

function checkHeader(header) {
    const required = [
        'location', 'country', 'parameter', 'unit', 'value', 'date_utc', 'date_local'
        , 'sourceType', 'mobile', 'coordinates_latitude', 'coordinates_longitude'
        , 'averagingPeriod_value', 'averagingPeriod_unit', 'attribution_name', 'attribution_url']
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

function verifyCsv(filestream) {
    return new Promise((resolve, reject) => {
        let records = [];
        let failures = [];
        let line = 0;
        filestream.pipe(csv())
            .on('error', () => {
                failures.push(failureType[0]);
                reject({failures})
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
                    if (rowKeys.indexOf('attribution_name_1') !== -1 || rowKeys.indexOf('attribution_url_1') !== -1) {
                        failures.push({
                            ...failureType[3],
                            details: `Found "attribution_name_1" or "attribution_url_1". Note that additional attributions start at "attribution_name_2" and "attribution_url_2"`
                        })
                        reject({ failures })
                    }
                    let searchingAttributions = true;
                    let attributionIndex = 2;
                    while (searchingAttributions) {
                        if (rowKeys.indexOf(`attribution_name_${attributionIndex}`) !== -1) {
                            if (rowKeys.indexOf(`attribution_url_${attributionIndex}`) !== -1) {
                                attributionIndex++;
                                continue
                            }
                            failures.push({
                                ...failureType[3],
                                details: `Record ${line}: found "attribution_name_${attributionIndex}", but not "attribution_url_${attributionIndex}"`
                            })
                        } else if (rowKeys.indexOf(`attribution_url_${attributionIndex}`) !== -1) {
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
                    if (records.length === 0) {
                        failures.push(failureType[0]);
                        reject({failures})
                    }   else {
                        // If no failures, convert record array to CSV
                        resolve({
                            failures: failures,
                            csvOutput: writeCsv(records)
                        })
                    }
                } 
                reject({ failures })
            });
    })
}


module.exports = verifyCsv