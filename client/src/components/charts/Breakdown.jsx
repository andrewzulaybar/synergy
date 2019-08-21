import { Col, Row, Skeleton } from 'antd';
import axios from 'axios';
import Chart from 'chart.js';
import React, { Component } from 'react';

import BaseChart from './Chart';
import { TransactionsContext } from '../transactions/Provider';
import { doughnutChart, tooltip } from '../../utils/color';
import { formatDate } from '../../utils/date';
import './Breakdown.css';

// returns index of maximum value in array
function findIndexOfMax(array) {
  return array.reduce(
    (indexOfMax, element, index, array) =>
      element > array[indexOfMax]
        ? index
        : indexOfMax, 0
  );
}

// formats tag by capitalizing the first letter of each word
function formatTag(tag) {
  return tag.toLowerCase()
    .split(' ')
    .map((tag) => tag.charAt(0).toUpperCase() + tag.substring(1))
    .join(' ');
}

class Breakdown extends Component {
  state = {
    weekBreakdown: [],
    monthBreakdown: [],
    yearBreakdown: [],
    weekLabels: [],
    monthLabels: [],
    yearLabels: [],
  };

  tags = [];
  numOfTags = 5;

  // retrieves expenses between start date and end date for each tag
  retrieveData = async timePeriod => {
    let data = [];
    const start = timePeriod[0];
    const end = timePeriod[timePeriod.length - 1];
    await axios.get('/api/transactions/tags')
      .then(res => this.tags = res.data.tags)
      .catch(error => console.log(error));

    await this.getExpenses(start, end, this.tags)
      .then(expensesByTag => data = expensesByTag)
      .catch(error => console.log(error));

    const sortedExpenses = this.getExpensesForTopTags([...data]);
    const sortedTags = (data.length > 1)
      ? this.getLabelsForTopTags([...data])
      : [];

    return [sortedExpenses, sortedTags];
  };

  // retrieves expenses between start date and end date for each tag in tags
  async getExpenses(start, end, tags) {
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

  // retrieves (meta)data for chart, then creates and renders chart
  displayChart = name => {
    let labels = [], data = [];
    if (name === 'week') {
      labels = this.state.weekLabels;
      data = this.state.weekBreakdown;
    } else if (name === 'month') {
      labels = this.state.monthLabels;
      data = this.state.monthBreakdown;
    } else if (name === 'year') {
      labels = this.state.yearLabels;
      data = this.state.yearBreakdown;
    }

    return new Chart(
      document.getElementById('doughnutChart').getContext('2d'),
      {
        type: 'doughnut',
        data: {
          datasets: [{
            backgroundColor: doughnutChart.colors,
            borderWidth: 0,
            data: data,
            hoverBackgroundColor: doughnutChart.colors,
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
        }
      }
    );
  };

  // callback function called after weekly breakdown have been retrieved
  weekCallback = data => {
    this.setState(currentState => {
      currentState.weekBreakdown = data[0];
      currentState.weekLabels = data[1];
      return currentState;
    });
  };

  // callback function called after monthly breakdown have been retrieved
  monthCallback = data => {
    this.setState(currentState => {
      currentState.monthBreakdown = data[0];
      currentState.monthLabels = data[1];
      return currentState;
    })
  };

  // callback function called after yearly breakdown have been retrieved
  yearCallback = data => {
    this.setState(currentState => {
      currentState.yearBreakdown = data[0];
      currentState.yearLabels = data[1];
      return currentState;
    })
  };

  render() {
    return (
      <Col {...this.props.span}>
        <TransactionsContext.Consumer>
          {context =>
            <BaseChart
              name="doughnutChart"
              title="Breakdown"
              subject={context.subject}
              displayChart={this.displayChart}
              getExpenses={this.retrieveData}
              weekCallback={this.weekCallback}
              monthCallback={this.monthCallback}
              yearCallback={this.yearCallback}
            >
              {(this.state.weekBreakdown.length === 0 || this.state.weekLabels.length === 0)
                ? <Skeleton active paragraph={{ rows: 6 }} />
                : <Row>
                    <canvas id="doughnutChart" />
                  </Row>}
            </BaseChart>
          }
        </TransactionsContext.Consumer>
      </Col>
    );
  }
}

export default Breakdown;