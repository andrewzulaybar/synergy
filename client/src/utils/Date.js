const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Creates date string according to specified format.
 *
 * @param {number} delay - Number of days since the date to be created (default 0).
 * @returns {string} - Date string of the format 'YYYY-MM-DD'.
 */
function createDate(delay = 0) {
  delay = delay === undefined ? 0 : delay;
  let date = new Date();
  date.setDate(date.getDate() - delay);
  return formatDate(date);
}

/**
 * Format the date to 'YYYY-MM-DD'.
 *
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date) {
  const separator = '-';
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + separator + pad(month) + separator + pad(day);
}

/**
 * Add leading zeroes if number is below 10.
 *
 * @param {number} n - The number to pad.
 * @returns {string} - The padded number, converted to string.
 */
function pad(n) {
  return n < 10 ? '0' + n : n.toString()
}

/**
 * Retrieves the days of the week of the past 7 days, including today.
 *
 * @returns {Array} - The list of the past 7 days.
 */
function getDayLabels() {
  let today = new Date().getDay();
  let dates = [], i;
  for (i = 0; i < 7; i++) {
    dates.push(days[today]);
    (today === 0)
      ? today = Object.keys(days).length - 1
      : today--;
  }
  return dates.reverse();
}

/**
 * Retrieves the last eight dates, including today.
 *
 * @returns {Array} - The list of the past 8 dates.
 */
function getLastEightDays() {
  let today = new Date();
  let lastEightDays = [], i;
  for (i = 0; i < 8; i++) {
    lastEightDays.push(new Date(today));
    today.setDate(today.getDate() - 1);
  }
  return lastEightDays.reverse();
}

/**
 * Creates labels for the past 5 weeks, including this week.
 *
 * @returns {Array} - The list of the past 5 weeks.
 */
function getMonthLabels() {
  let today = new Date();
  let weeks = [], i;
  for (i = 0; i < 5; i++) {
    weeks.push((months[today.getMonth()]) + ' ' + today.getDate());
    today.setDate(today.getDate() - 7);
  }
  return weeks.reverse();
}

/**
 * Retrieves the past 6 weeks, including this week.
 *
 * @returns {Array} - The list of the past 6 weeks.
 */
function getWeeksOfMonth() {
  let today = new Date();
  let weeks = [], i;
  for (i = 0; i < 6; i++) {
    weeks.push(new Date(today));
    today.setDate(today.getDate() - 7);
  }
  return weeks.reverse();
}

export {
  createDate,
  formatDate,
  getDayLabels,
  getLastEightDays,
  getMonthLabels,
  getWeeksOfMonth,
};