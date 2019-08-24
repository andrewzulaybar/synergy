import axios from "axios";

import { doughnutChart, tooltip } from '../misc/color';
import { formatDate } from '../misc/date';

/**
 * The number of tags to show and retrieve breakdowns for.
 *
 * @type {number}
 */
const numOfTags = 5;

/**
 * Returns data for chart.
 *
 * @param {Array} labels - The top n labels for the breakdown.
 * @param {Array} data - The dollar amounts spent in each of the n categories.
 * @returns {Object} - The data object.
 */
const data = (labels, data) => {
  return {
    datasets: [{
      backgroundColor: doughnutChart.colors,
      borderWidth: 0,
      data: data,
      hoverBackgroundColor: doughnutChart.colors,
    }],
    labels: labels,
  }
};

/**
 * The options for the chart.
 *
 * @type Object
 */
const options = {
  cutoutPercentage: 70,
  layout: {
    padding: {
      bottom: 20,
      left: 0,
      right: 0,
      top: 40,
    }
  },
  legend: {
    labels: {
      boxWidth: 7,
      usePointStyle: true,
    },
    onClick: null,
    position: 'right'
  },
  tooltips: {
    backgroundColor: tooltip.backgroundColor,
    bodyAlign: 'center',
    bodyFontColor: tooltip.textColor,
    callbacks: {
      label: (tooltip, object) => {
        const data = object.datasets[tooltip.datasetIndex].data;
        const total = data.reduce((acc, dataPoint) => {
          return acc + dataPoint
        });
        const category = data[tooltip.index];
        return (category / total * 100).toFixed(1) + '%';
      },
      title: (tooltipArray, object) => {
        return object.labels[tooltipArray[0].index] + ':';
      },
    },
    displayColors: false,
    titleAlign: 'center',
    titleFontColor: tooltip.textColor,
    xAlign: 'center',
    yAlign: 'bottom',
  }
};

/**
 * Retrieves expenses for past week from API.
 *
 * @returns {Promise<Object>} - An object with the list of tags and list of expenses (sorted in decreasing order).
 */
function getWeekBreakdown() {
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return retrieveData(sixDaysAgo, tomorrow);
}

/**
 * Retrieves expenses for past month from API.
 *
 * @returns {Promise<Object>} - An object with the list of tags and list of expenses (sorted in decreasing order).
 */
function getMonthBreakdown() {
  const fiveWeeksAgo = new Date();
  fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 5 * 7);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return retrieveData(fiveWeeksAgo, tomorrow);
}

/**
 * Retrieves expenses for past year from API.
 *
 * @returns {Promise<Object>} - An object with the list of tags and list of expenses (sorted in decreasing order).
 */
function getYearBreakdown() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  const nextMonth = new Date();
  nextMonth.setFullYear(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
  return retrieveData(twelveMonthsAgo, nextMonth);
}

/**
 * Retrieves summaries for each tag between start date and end date.
 *
 * @param {Date} start - The starting date.
 * @param {Date} end - The ending date.
 * @returns {Promise<Object>} - An object with the list of tags and list of expenses (sorted in decreasing order).
 */
async function retrieveData(start, end) {
  let data = [];
  let tags = [];
  await axios.get('/api/transactions/tags')
    .then(res => tags = res.data.tags)
    .catch(error => console.log(error));

  await getExpenses(start, end, tags)
    .then(expensesByTag => data = expensesByTag)
    .catch(error => console.log(error));

  const sortedExpenses = getExpensesForTopTags([...data]);
  const sortedTags = getLabelsForTopTags([...data], tags);

  return { expenses: sortedExpenses, labels: sortedTags }
}

/**
 * Retrieves expenses between start date and end date for each tag in tags.
 *
 * @param {Date} start - The starting date.
 * @param {Date} end - The ending date.
 * @param {string[]} tags - The tags to retrieve summaries for.
 * @returns {Promise<Array>} - An array containing the expenses for each tag in tags.
 */
async function getExpenses(start, end, tags) {
  let data = [];
  for (let i = 0; i < tags.length; i++) {
    await new Promise(resolve => {
      axios.get('api/transactions/summary', {
        params: {
          type: 'expenses',
          start: formatDate(start),
          end: formatDate(end),
          tag: tags[i],
        }
      })
        .then(res => {
          data.push(Math.abs(res.data.summary.sum));
          resolve();
        })
        .catch(error => console.log(error))
    });
  }
  return data;
}

/**
 * Retrieves expenses for the top (numOfTags - 1) tags, aggregating the rest into 'other'.
 *
 * @param {Array} array - The array of expenses for all tags.
 * @returns {Array} - An array containing the expenses for the top (numOfTags) tags.
 */
function getExpensesForTopTags(array) {
  const sortedExpenses = [];
  let i = 0, indexOfMax;
  while (i < numOfTags - 1 && array.length >= 1) {
    indexOfMax = findIndexOfMax(array);
    sortedExpenses.push(array[indexOfMax]);
    array.splice(indexOfMax, 1);
    i++;
  }
  let other = 0;
  array.forEach((val) => other += val);
  sortedExpenses.push(other);
  return sortedExpenses;
}

/**
 * Retrieves labels for top (numOfTags - 1) tags, aggregating the rest into 'other'.
 *
 * @param {number[]} array - The array of expenses for all tags.
 * @param {string[]} tags - The array of names of all tags.
 * @returns {Array} - An array containing the names for the top (numOfTags) tags.
 */
function getLabelsForTopTags(array, tags) {
  const copyOfTags = [...tags];
  let i = 0, indexOfMax, sortedTags = [];
  while (i < numOfTags - 1 && array.length >= 1) {
    indexOfMax = findIndexOfMax(array);
    sortedTags.push(formatTag(copyOfTags[indexOfMax]));
    array.splice(indexOfMax, 1);
    copyOfTags.splice(indexOfMax, 1);
    i++;
  }
  sortedTags.push('Other');
  return sortedTags;
}

/**
 * Returns the index of the maximum value in the array.
 *
 * @param {number[]} array - The array of numbers of search.
 * @returns {number} - The index of the maximum value in the array.
 */
function findIndexOfMax(array) {
  return array.reduce(
    (indexOfMax, element, index, array) =>
      element > array[indexOfMax]
        ? index
        : indexOfMax, 0
  );
}

/**
 * Formats tag by capitalizing the first letter of each word.
 *
 * @param {string} tag - The name of the tag.
 * @returns {string} - The formatted tag name.
 */
function formatTag(tag) {
  return tag.toLowerCase()
    .split(' ')
    .map((tag) => tag.charAt(0).toUpperCase() + tag.substring(1))
    .join(' ');
}

export {
  data,
  options,
  getWeekBreakdown,
  getMonthBreakdown,
  getYearBreakdown
};