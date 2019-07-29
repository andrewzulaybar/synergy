import { Button, Card, Col, Row, Typography } from 'antd';
import axios from 'axios';
import Chart from 'chart.js';
import React, { Component } from 'react';

import { tooltip } from '../../../utils/Color';
import { formatDate, getLastEightDays } from "../../../utils/Date";
import './DoughnutChart.css';

// calculates percentages of chart slices
function calculatePercentages(tooltip, object) {
  const data = object.datasets[tooltip.datasetIndex].data;
  const total = data.reduce((acc, dataPoint) => {
    return acc + dataPoint
  });
  const category = data[tooltip.index];
  return Math.round(category / total * 100) + '%';
}

// formats tag by capitalizing the first letter of each word
function formatTag(tag) {
  return tag.toLowerCase()
    .split(' ')
    .map((tag) => tag.charAt(0).toUpperCase() + tag.substring(1))
    .join(' ');
}

// returns index of maximum value in array
function findIndexOfMax(array) {
  return array.reduce(
    (indexOfMax, element, index, array) =>
      element > array[indexOfMax]
        ? index
        : indexOfMax, 0
  );
}

// formats tooltip title
function formatTooltipTitle(tooltipArray, object) {
  return object.labels[tooltipArray[0].index] + ':';
}

// retrieves expenses between start date and end date for each tag in tags
async function getExpenses(start, end, tags) {
  let data = [], i;
  for (i = 0; i < tags.length; i++) {
    await axios.get('api/transactions/summary', {
      params: {
        type: 'expenses',
        start: formatDate(start),
        end: formatDate(end),
        tag: tags[i],
      }
    })
      .then(res => data.push(Math.abs(res.data.summary.sum)))
      .catch(error => console.log(error));
  }
  return data;
}

class DoughnutChart extends Component {
  tags = [];
  numOfTags = 5;

  componentDidMount() {
    const lastEightDays = getLastEightDays();
    const start = lastEightDays[0];
    const end = lastEightDays[7];

    axios.get('/api/transactions/tags')
      .then(res => {
        this.tags = res.data.tags;

        // retrieve data for this week
        this.retrieveData(start, end)
          .then(data => this.displayChart(data[0], data[1]))
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  // retrieves expenses between start date and end date for each tag
  async retrieveData(start, end) {
    let data = [];
    await getExpenses(start, end, this.tags)
      .then(expensesByTag => data = expensesByTag)
      .catch(error => console.log(error));

    const sortedExpenses = this.getExpensesForTopTags([...data]);
    const sortedTags = (data.length > 1)
      ? this.getLabelsForTopTags([...data])
      : [];

    return [sortedTags, sortedExpenses];
  }

  // retrieves labels for top (numOfTags - 1) tags, aggregating the rest into 'other'
  getLabelsForTopTags(array) {
    const tags = [...this.tags];
    let i = 0, indexOfMax, sortedTags = [];
    while (i < this.numOfTags - 1) {
      indexOfMax = findIndexOfMax(array);
      sortedTags.push(formatTag(tags[indexOfMax]));
      array.splice(indexOfMax, 1);
      tags.splice(indexOfMax, 1);
      i++;
    }

    sortedTags.push('Other');

    return sortedTags;
  }

  // retrieves expenses for the top (numOfTags - 1) tags, aggregating the rest into 'other'
  getExpensesForTopTags(array) {
    const sortedExpenses = [];
    let i = 0, indexOfMax;
    while (i < this.numOfTags - 1) {
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

  displayChart(labels, data) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          backgroundColor: ['#80b6f4', '#b8c2fa', '#e1d0fd', '#ffe1ff', '#ffc3e0', '#ffa7b4'],
          borderWidth: 0,
          data: data,
        }],
        labels: labels,
      },
      options: {
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
              return calculatePercentages(tooltip, object);
            },
            title: (tooltipArray, object) => {
              return formatTooltipTitle(tooltipArray, object);
            },
          },
          displayColors: false,
          titleAlign: 'center',
          titleFontColor: tooltip.textColor,
          xAlign: 'center',
          yAlign: 'bottom',
        }
      }
    });
  }

  render() {
    return (
      <Col {...this.props.span}>
        <Card className="doughnutChart">
          <Row>
            <Col span={8}>
              <Typography.Title level={2} className="chartHeader">
                Breakdown
              </Typography.Title>
            </Col>
            <Col span={16} align="right" className="buttonGroup">
              <Button.Group size="small">
                <Button name="week">Week</Button>
                <Button name="month">Month</Button>
                <Button name="year">Year</Button>
              </Button.Group>
            </Col>
          </Row>
          <Row>
            <canvas id="doughnutChart" />
          </Row>
        </Card>
      </Col>
    );
  }
}

export default DoughnutChart;