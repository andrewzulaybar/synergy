import axios from 'axios';

import { lineChart, tooltip } from '../misc/color';
import { formatDate, getLastFiveWeeks, getLastSevenDays, getLastTwelveMonths } from '../misc/date';

/**
 * Returns data for chart.
 *
 * @param {Array} labels - The x-axis labels for the time period.
 * @param {Array} data - The dollar amounts spent on each day, week, or month.
 * @returns {Object} - The data object.
 */
const data = (labels, data) => {
  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: lineChart.fillColor,
        borderColor: lineChart.strokeColor,
        data: data,
        pointBackgroundColor: lineChart.strokeColor,
      }
    ]
  }
};

/**
 * The options for the chart.
 *
 * @type Object
 */
const options = {
  hover: {
    animationDuration: 500
  },
  layout: {
    padding: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 50,
    }
  },
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        display: false,
        drawBorder: false,
      }
    }],
    yAxes: [{
      beginAtZero: true,
      gridLines: {
        drawBorder: false,
        borderDash: [8, 4],
        color: "#e5e5e5",
        zeroLineWidth: 0,
      },
      ticks: {
        maxTicksLimit: 5,
        padding: 10,
      }
    }]
  },
  tooltips: {
    backgroundColor: tooltip.backgroundColor,
    bodyAlign: 'center',
    bodyFontColor: tooltip.textColor,
    callbacks: {
      label: (tooltip, object) => {
        const yLabel = object.datasets[tooltip.datasetIndex].data[tooltip.index];
        return '$ ' + yLabel;
      }
    },
    displayColors: false,
    intersect: false,
    titleAlign: 'center',
    titleFontColor: tooltip.textColor,
    xAlign: 'center',
    yAlign: 'bottom',
  }
};

/**
 * Retrieves expenses for past week from API.
 *
 * @returns {Promise<Array>} - An array of expenses summaries for each day in the past week.
 */
function getWeekExpenses() {
  const lastEightDays = getLastSevenDays();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  lastEightDays.push(tomorrow);
  return getExpenses(lastEightDays);
}

/**
 * Retrieves expenses for past month from API.
 *
 * @returns {Promise<Array>} - An array of expenses summaries for each week in the past month.
 */
function getMonthExpenses() {
  const lastSixWeeks = getLastFiveWeeks();
  const date = new Date();
  date.setDate(date.getDate() + 1);
  lastSixWeeks.push(date);
  return getExpenses(lastSixWeeks);
}

/**
 * Retrieves expenses for past year from API.
 *
 * @returns {Promise<Array>} - An array of expenses summaries for each month in the past year.
 */
function getYearExpenses() {
  const lastThirteenMonths = getLastTwelveMonths();
  const nextMonth = new Date();
  nextMonth.setFullYear(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
  lastThirteenMonths.push(nextMonth);
  return getExpenses(lastThirteenMonths);
}

/**
 * Retrieves expenses for each period from timePeriod[i] to timePeriod[i + 1].
 *
 * @param {Date[]} timePeriod - An array of time periods to retrieve summaries for.
 * @returns {Promise<Array>} - An array of expenses summaries for each of the time periods.
 */
async function getExpenses(timePeriod) {
  let data = [];
  for (let i = 0; i < timePeriod.length - 1; i++) {
    await new Promise(resolve => {
      axios.get('api/transactions/summary', {
        params: {
          type: 'expenses',
          start: formatDate(timePeriod[i]),
          end: formatDate(timePeriod[i + 1])
        }
      })
        .then(res => {
          data.push(Math.abs(res.data.summary.sum).toFixed(2));
          resolve();
        })
        .catch(error => console.log(error))
    });
  }
  return data;
}

export {
  data,
  options,
  getWeekExpenses,
  getMonthExpenses,
  getYearExpenses,
};