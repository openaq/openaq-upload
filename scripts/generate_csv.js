var stringify = require('csv-stringify');
const fetch = require('node-fetch');

const testData = require('./test')

// example data
// var data = [
//     {"date":{"utc":"2020-09-16T16:00:00.000Z","local":"2020-09-17T00:00:00+08:00"},"parameter":"pm25","value":6,"unit":"µg/m³","averagingPeriod":{"value":1,"unit":"hours"},"location":"Beijing US Embassy","city":"Beijing","country":"CN","coordinates":{"latitude":39.95,"longitude":116.47},"attribution":[{"name":"StateAir.net","url":"http://www.stateair.net/web/post/1/1.html"}],"sourceName":"Beijing US Embassy","sourceType":"government","mobile":false}
// ]

// console.log(testData)

function addColumn(columns, column) {
    if (columns.indexOf(column) === -1) {
        return [...columns, column] 
    }
    return columns
}

fetch('https://api.openaq.org/v1/measurements?include_fields=sourceType,attribution,sourceName,averagingPeriod,mobile&limit=10')
    .then(res => res.json())
    .then(json => {
        // add all required columns
        var columns = [
            'parameter',
            'location',
            'city',
            'country',
            'value',
            'unit',
            'date/utc',
            'date/local',
            'sourceName',
            'sourceType',
            'mobile',
        ];
        var records = json.results.map(function (r) {
            r['date/utc'] = r.date.utc;
            r['date/local'] = r.date.local;
            if (r.coordinates) {
              r['coordinates/latitude'] = r.coordinates.latitude;
              r['coordinates/longitude'] = r.coordinates.longitude;
              columns = addColumn(columns, 'coordinates/latitude')
              columns = addColumn(columns, 'coordinates/longitude')
            }
            if (r.averagingPeriod) {
                console.log(r.averagingPeriod)
                r['averagingPeriod/value'] = r.averagingPeriod.value
                r['averagingPeriod/unit'] = r.averagingPeriod.unit
                columns = addColumn(columns, 'averagingPeriod/unit')
                columns = addColumn(columns, 'averagingPeriod/value')
            } 
            if (r.attribution) {
                if (r.attribution.length === 1) {
                    if (r.attribution[0].name) {
                        r[`attribution/name`] = r.attribution[0].name
                        columns = addColumn(columns, `attribution/name`)
                    }
                    if (r.attribution[0].url) {
                        r[`attribution/url`] = r.attribution[0].url
                        columns = addColumn(columns, `attribution/url`)
                    }
                } else {
                    columns = addColumn(columns, `attribution`)
                }
            }
            if (typeof r['mobile'] === 'boolean') {
                // bug: https://github.com/adaltas/node-csv-stringify/issues/27
                if (r['mobile'] === false) {
                    r['mobile'] = 'false'                  
                } else {
                    r['mobile'] = 'true'
                }
            }
            return r;
        });
        var options = {
            header: true,
            columns: columns
        }
        stringify(records, options, function (err, data) {
            if (err) {
                console.log(err)
            }
            console.log(data)
        });
    });

