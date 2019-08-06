import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import axios from 'axios';
import Chart from 'chart.js';
import React, { Component } from 'react';

import { doughnutChart, tooltip } from '../../utils/color';
import {
  formatDate,
  getLastEightDays,
  getWeeksOfMonth,
  getMonthsOfYear,
} from "../../utils/date";
import '../../screens/home/Home.css';

// calculates percentages of chart slices
function calculatePercentages(tooltip, object) {
  const data = object.datasets[tooltip.datasetIndex].data;
  const total = data.reduce((acc, dataPoint) => {
    return acc + dataPoint
  });
  const category = data[tooltip.index];
  return Math.round((category / total * 100) * 10) / 10 + '%';
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

// formats tag by capitalizing the first letter of each word
function formatTag(tag) {
  return tag.toLowerCase()
    .split(' ')
    .map((tag) => tag.charAt(0).toUpperCase() + tag.substring(1))
    .join(' ');
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

class Breakdown extends Component {
  state = {
    chart: null,
    chartType: null,
    weekBreakdown: [],
    monthBreakdown: [],
    yearBreakdown: [],
    weekLabels: [],
    monthLabels: [],
    yearLabels: [],
  };

  tags = [];
  numOfTags = 5;

  componentDidMount() {
    const { subject } = this.props;
    subject.addObserver(this);

    axios.get('/api/transactions/tags')
      .then(res => {
        this.tags = res.data.tags;
        this.setState(
          { chartType: 'week'},
          () => this.update()
        );
      })
      .catch(error => console.log(error));
  }

  // called when transactions have been updated: re-renders chart
  update() {
    this.retrieveBreakdowns()
      .then(() => this.displayChart(this.state.chartType))
      .catch(error => console.log(error));
  }

  // helper for retrieving weekly, monthly, and yearly breakdowns
  async retrieveBreakdowns() {
    const lastEightDays = getLastEightDays();
    const week = this.retrieveData(lastEightDays[0], lastEightDays[7])
      .then(data =>
        this.setState(currentState => {
          currentState.weekBreakdown = data[0];
          currentState.weekLabels = data[1];
          return currentState;
        })
      )
      .catch(error => console.log(error));

    const lastTwelveMonths = getMonthsOfYear();
    const year = this.retrieveData(lastTwelveMonths[0], lastTwelveMonths[12])
      .then(data =>
        this.setState(currentState => {
          currentState.yearBreakdown = data[0];
          currentState.yearLabels = data[1];
          return currentState;
        })
      )
      .catch(error => console.log(error));

    const lastSixWeeks = getWeeksOfMonth();
    const month = this.retrieveData(lastSixWeeks[0], lastSixWeeks[5])
      .then(data =>
        this.setState(currentState => {
          currentState.monthBreakdown = data[0];
          currentState.monthLabels = data[1];
          return currentState;
        })
      )
      .catch(error => console.log(error));

    await week;
    await month;
    await year;
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

    return [sortedExpenses, sortedTags];
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

  // handler for button onClick: updates which chart is displayed
  handleClick = e => {
    e.preventDefault();
    this.setState({ chartType: e.target.name});
    this.displayChart(e.target.name);
  };

  // retrieves (meta)data for chart, then creates and renders chart
  displayChart(name) {
    if (this.state.chart) this.state.chart.destroy();

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

    this.renderLineChart(data, labels);
  }

  // helper that creates and renders chart, given data and labels
  renderLineChart(data, labels) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');

    const chart = new Chart(ctx, {
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
    this.setState({ chart: chart });
  }

  render() {
    const header = (
      <Row>
        <Col span={8} align="left">
          <Typography.Title level={2} className="chartHeader">
            Breakdown
          </Typography.Title>
        </Col>
        <Col span={16} align="right" className="buttonGroup">
          <Button.Group size="small">
            <Button onClick={this.handleClick} name="week">Week</Button>
            <Button onClick={this.handleClick} name="month">Month</Button>
            <Button onClick={this.handleClick} name="year">Year</Button>
          </Button.Group>
        </Col>
      </Row>
    );

    return (
      <Col {...this.props.span}>
        <Card className="doughnutChart" title={header} bordered={false}>
          {(this.state.weekBreakdown.length === 0 || this.state.weekLabels.length === 0)
            ? <Skeleton active paragraph={{ rows: 6 }} />
            : <Row>
                <canvas id="doughnutChart" />
              </Row>}
        </Card>
      </Col>
    );
  }
}

export default Breakdown;