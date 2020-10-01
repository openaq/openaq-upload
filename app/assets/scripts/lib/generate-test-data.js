const jsf = require('json-schema-faker');
const { schemas } = require('openaq-data-format');

schemas.location.properties.id.faker = 'random.alphaNumeric';
schemas.location.properties.city.faker = 'address.city';
schemas.location.properties.country.faker = 'address.countryCode';
schemas.location.properties.elevation.minimum = 0;
schemas.location.properties.elevation.maximum = 4000;
schemas.location.properties.activationDate.faker = 'date.past';
schemas.location.properties.deactivationDate.faker = 'date.past';
schemas.location.properties.coordinates.properties.latitude.faker = 'address.latitude';
schemas.location.properties.coordinates.properties.longitude.faker = 'address.longitude';
schemas.location.properties.instruments.items.properties.activationDate.faker = 'date.past';
schemas.location.properties.instruments.items.properties.deactivationDate.faker = 'date.past';

jsf.option('alwaysFakeOptionals', true);
jsf.option('fillProperties', true);
jsf.option('optionalsProbability', 1);
jsf.extend('faker', () => require('faker'));

module.exports = function generateTestData () {
  const results = [];
  let total = 10;

  while (total > 0) {
    results.push(jsf.generate(schemas.location));
    total--;
  }

  return results;
};
