export const calcDateRange = (dates) => {
  const orderedDates = Object.keys(dates).sort(function (a, b) {
    return Date.parse(a) > Date.parse(b);
  });
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
