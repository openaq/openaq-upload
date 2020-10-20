# OpenAQ Data Upload Tool format

A description of the data format for uploading data using the OpenAQ Data Upload tool

|Field|Type|Required|Description|Example|
|---|---|:---:|---|---|
|parameter|String|✓|The measured parameter; acceptable values are `pm25, pm10, co, bc, so2, no2, o3`|`"pm25"`|
|location|String|✓|Unique location name of the station|`"Escuela E-10"`|
|city|String|✓|City (or regional approximation) containing location|`"Tocopilla"`|
|country|String|✓|Country containing location in two letter ISO format|`"CL"`|
|value|Number|✓|Recorded value|`10.2`|
|unit|String|✓|Unit of measurement, see [note about units](https://github.com/openaq/openaq-data-format#preferred-units) below; acceptable values are `µg/m³, ppm`|`"µg/m³"`|
|date/utc|String|✓|Time of measurement for UTC time. See [note about dates](https://github.com/openaq/openaq-data-format#dates-and-date-ranges).|`"2015-10-26T17:00:00.000Z"`|
|date/local|String|✓|Time of measurement for local time time. See [note about dates](https://github.com/openaq/openaq-data-format#dates-and-date-ranges).|`"2015-10-26T14:00:00-03:00"`|
|sourceName|String|✓|ID to track measurement to source within the platform|`"Netherlands"`|
|sourceType|String|✓|The [type of source](https://github.com/openaq/openaq-data-format#source-types); acceptable values are: `government, research, other` | `"government"` |
|mobile|Boolean|✓|Indicates whether the measuring station is stationary or mobile|`false`|
|coordinates/latitude|Number||Latitude of measurement|`-22.087`|
|coordinates/longitude|Number||Longitude of measurement|`-70.193253`|
|attribution|Array||Data attribution in descending order of prominence|`[{"name": "TCEQ", "url":"http://www.tceq.state.tx.us"}, {"name": "City of Houston Health Department"}]`|
|attribution/name/1|String||Data attribution name for the first attribution|`"TCEQ"`|
|attribution/url/1|String||Data attribution url for the first attribution|`"http://www.tceq.state.tx.us`|
|attribution/name/2|String||Data attribution name for the first attribution|`"TCEQ2"`|
|attribution/url/2|String||Data attribution url for the first attribution|`"http://www.tceq.state.tx.us`|
|attribution/name/3|String||Data attribution name for the first attribution|`"TCEQ3"`|
|attribution/url/3|String||Data attribution url for the first attribution|`"http://www.tceq.state.tx.us`|
|averagingPeriod/value|Number||Information about the time resolution value|`1`|
|averagingPeriod/unit|String||Information about the time resolution unit of the measurement|`"hours"`|

### Dates and date ranges
Dates are sent as a string date containing a local time and a UTC time.

UTC

```json
"2015-07-16T20:30:00.000Z"
```

Local

```json
"2015-07-17T03:30:00.000+07:00"
```

The averages are always backward looking. That means that if a source reports a time range (3 - 4pm), then the latest time is picked (4pm).

## Dealing with multiple measurements
It is possible that a station reports several measurements for the same pollutant per time period. When this occurs, the following measurement is stored:

- the one with the shortest averaging period (1 hour average instead of 24 hour rolling average)
- the one that reports the value in the pollutant's [preferred unit](https://github.com/openaq/openaq-data-format#preferred-units)

## Preferred Units
OpenAQ only accepts measurements in `µg/m³` and `ppm`. This means that volumetric concentrations reported in ppb are converted to ppm before being stored to the database. We do not convert between volumetric and mass concentrations (`µg/m³` <-> `ppm`) to avoid making assumptions.

The platform also has a preferred unit of measurement per pollutant, but this is not strictly enforced. The Dutch locations, for example, report all their values in µg/m3.

|Pollutant|Preferred unit|
|---|---|
|PM 2.5|µg/m³|
|PM 10|µg/m³|
|BC|µg/m³|
|CO|ppm|
|NO2|ppm|
|SO2|ppm|
|O3|ppm|

## Source types
Measurements can be provided by different types of sources:

- `government` - Sensors that are deployed by or on behalf of governmental bodies.
- `research` - Sensors that are deployed by researchers affiliated with universities and/or research organizations.
- `other` - Sensors that are deployed by citizen scientists, often low-cost sensors.

## Attributions

Attributions can be submitted either as a JSON string (using double quotations), or as separate attributions. *Note* if you have more than 3 attributions, you **must** send attributions as a JSON string Array. 

example of two attributions being sent 

Column: `attribution/name/1`, Value: `"TCEQ"`
Column: `attribution/url/1`, Value: `"http://www.tceq.state.tx.us`
Column: `attribution/name/2`, Value: `"TCEQ2"`
Column: `attribution/url/2`, Value: `"http://www.tceq.state.tx.us`

example of attributions being sent as JSON string: 

```
"[{""url"":""https://app.cpcbccr.com/ccr/#/caaqm-dashboard-all/caaqm-landing"",""name"":""Central Pollution Control Board""}, {""url"":""https://app.cpcbccr.com/ccr/#/caaqm-dashboard-all/caaqm-landing"",""name"":""Central Pollution Control Board 2""}]"
```