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

export { createDate, formatDate };