import _ from 'lodash';

export const calcDateRange = (dates) => {
  const orderedDates = Object.keys(dates).sort((a, b) => Date.parse(a) > Date.parse(b));
  const early = new Date(orderedDates[0]);
  const late = new Date(orderedDates[orderedDates.length - 1]);
  return `${early.getFullYear()}/${early.getMonth() + 1}/${early.getDate()} - ${late.getFullYear()}/${late.getMonth() + 1}/${late.getDate()}`;
};

export const uniqueValues = (values) => {
  let string = '';
  Object.keys(values).forEach((val) => {
    string += val + ', ';
  });
  return string.substring(0, string.length - 2);
};

export const mostFrequentString = (values, type) => {
  // Calculates the most frequently occuring string, along with how often it occurs
  const countUniques = _.chain(values).countBy();
  const mostFrequent = countUniques.toPairs().sortBy(1).reverse().value()[0];
  const totalOthers = Object.keys(countUniques.value()).length;
  if (totalOthers > 1) {
    return `${mostFrequent[1]} in ${mostFrequent[0]}, ${values.length} total in ${totalOthers} others`;
  }
  return `${mostFrequent[1]} in ${mostFrequent[0]}`;
};
