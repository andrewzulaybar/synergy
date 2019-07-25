const days = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };

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
function getDaysOfWeek() {
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

export {
  createDate,
  formatDate,
  getDaysOfWeek,
  getLastEightDays
};