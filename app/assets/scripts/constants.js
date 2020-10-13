const failureType = {
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

module.exports = failureType