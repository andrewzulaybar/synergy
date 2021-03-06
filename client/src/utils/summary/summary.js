import axios from 'axios';

import { createDate, formatDate } from '../misc/date';

/**
 * Calculates summary statistics.
 *
 * @returns {Promise<Object[]>} - The array containing the week expenses, month expenses, and month income objects.
 */
async function retrieveSummary() {
  const promises = [updateWeeklyExpenses(), updateMonthlyExpenses(), updateMonthlyIncome()];
  const [weekExpenses, monthExpenses, monthIncome] = await Promise.all(promises);
  return [weekExpenses, monthExpenses, monthIncome];
}

/**
 * Retrieves expenses for the current week and the previous week.
 *
 * @returns {Promise<Object>} - Object containing the expenses for the current week and the previous week.
 */
async function updateWeeklyExpenses() {
  let end = createDate(-1);
  let thisWeekStart = createDate(6);
  let lastWeekStart = createDate(13);

  return retrievePeriodSummary(lastWeekStart, thisWeekStart, end, 'expenses');
}

/**
 * Retrieves expenses for the current month and the previous month.
 *
 * @returns {Promise<Object>} - Object containing the expenses for the current month and the previous month.
 */
async function updateMonthlyExpenses() {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let end = formatDate(tomorrow);
  let thisMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
  let lastMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth() - 1, 1));

  return retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'expenses');
}

/**
 * Retrieves income for the current month and the previous month.
 *
 * @returns {Promise<Object>} - Object containing the income for the current month and the previous month.
 */
async function updateMonthlyIncome() {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let end = formatDate(tomorrow);
  let thisMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
  let lastMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth() - 1, 1));

  return retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'income');
}

/**
 * Retrieves summary of given type for current period and previous period.
 *
 * @param {string} lastPeriodStart - The starting date for the last period.
 * @param {string} thisPeriodStart - The ending date for the last period; the starting date for the current period.
 * @param {string} thisPeriodEnd - The ending date for the current period.
 * @param {string} type - The type of transaction summary to retrieve, either 'income' or 'expenses'.
 * @returns {Promise<Object>} - Object containing the summary for the current period and the previous period.
 */
async function retrievePeriodSummary(lastPeriodStart, thisPeriodStart, thisPeriodEnd, type) {
  const thisPeriodTotal = getPeriodSummary(thisPeriodStart, thisPeriodEnd, type);
  const lastPeriodTotal = getPeriodSummary(lastPeriodStart, thisPeriodStart, type);
  const [current, previous] = await Promise.all([thisPeriodTotal, lastPeriodTotal]);

  return { current: current, previous: previous };
}

/**
 * Retrieves total income or expenses (according to given type) for given period.
 *
 * @param {string} start - The starting date for the time period.
 * @param {string} end - The ending date for the time period.
 * @param {string} type - The type of transaction summary to retrieve, either 'income' or 'expenses'.
 * @returns {Promise<number>} - The total income or expenses for the given time period.
 */
async function getPeriodSummary(start, end, type) {
  let total = 0;
  await axios.get('api/transactions/summary', {
    params: {
      type: type,
      start: start,
      end: end,
    }
  })
    .then(res => total = Math.abs(res.data.summary.sum))
    .catch(error => console.log(error));
  return total;
}

/**
 * Rounds amount to two decimal places.
 *
 * @param {number} amount - The amount to round.
 * @returns {string} - The amount rounded to two decimal places.
 */
function toTwoDecimalPlaces(amount) {
  return amount.toFixed(2);
}

/**
 * Calculates percent change between previous and current period.
 *
 * @param {Object} amount - The object containing the amounts for the previous and current period.
 * @returns {number} - The percent change between the previous and current period.
 */
function percentChange(amount) {
  const current = amount.current;
  const previous = amount.previous;
  return Math.round((previous !== 0) ? (current - previous) / previous * 100 : current);
}

export {
  retrieveSummary,
  toTwoDecimalPlaces,
  percentChange
}