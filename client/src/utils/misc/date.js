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
 * Creates labels for the past 7 days, including today.
 *
 * @returns {string[]} - The labels for the past 7 days, including today.
 */
function getDayLabels() {
  const lastSevenDays = getLastSevenDays();
  return lastSevenDays.map(date => days[date.getDay()]);
}

/**
 * Retrieves the dates for the past 7 days, including today.
 *
 * @returns {Date[]} - The list of the past 7 dates, including today.
 */
function getLastSevenDays() {
  let date = new Date();
  let lastSevenDays = [];
  for (let i = 0; i < 7; i++) {
    lastSevenDays.push(new Date(date));
    date.setDate(date.getDate() - 1);
  }
  return lastSevenDays.reverse();
}

/**
 * Creates labels for the past 5 weeks, including this week.
 *
 * @returns {string[]} - The labels for the past 5 weeks, including this week.
 */
function getWeekLabels() {
  const lastFiveWeeks = getLastFiveWeeks();
  return lastFiveWeeks.map(date => months[date.getMonth()] + ' ' + date.getDate());
}

/**
 * Retrieves the start dates for the past 5 weeks, including this week.
 *
 * @returns {Date[]} - The list of start dates for the past 5 weeks, including this week.
 */
function getLastFiveWeeks() {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  let lastFiveWeeks = [];
  for (let i = 0; i < 5; i++) {
    lastFiveWeeks.push(new Date(date));
    date.setDate(date.getDate() - 7);
  }
  return lastFiveWeeks.reverse();
}

/**
 * Creates labels for the past 12 months, including this month.
 *
 * @returns {string[]} - The labels for the past 12 months, including this month.
 */
function getMonthLabels() {
  const lastTwelveMonths = getLastTwelveMonths();
  return lastTwelveMonths.map(date => months[date.getMonth()]);
}

/**
 * Retrieves the end dates for the past 12 months, including this month.
 *
 * @returns {Date[]} - The list of end dates for the past 12 months, including this month.
 */
function getLastTwelveMonths() {
  let date = new Date();
  let lastTwelveMonths = [];
  for (let i = 0; i < 12; i++) {
    date.setDate(1);
    lastTwelveMonths.push(new Date(date));
    date.setMonth(date.getMonth() - 1);
  }
  return lastTwelveMonths.reverse();
}

export {
  createDate,
  formatDate,
  getDayLabels,
  getLastSevenDays,
  getWeekLabels,
  getLastFiveWeeks,
  getMonthLabels,
  getLastTwelveMonths,
};