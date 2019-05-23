function formatDate(timestamp) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const date = new Date(timestamp);

  const format = {
    datetime: `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`,
    readable: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`,
  };

  return format;
}

function sortByDate(arr, property) {
  return arr.sort((a, b) => {
    if (a[property] === b[property]) {
      return 0;
    }
    return a[property] > b[property] ? -1 : 1;
  });
}

module.exports = {
  formatDate,
  sortByDate,
};