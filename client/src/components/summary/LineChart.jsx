import { Button, Card, Col, Row, Typography } from 'antd';
import axios from 'axios';
import Chart from 'chart.js';
import React, { Component } from 'react';

import './LineChart.css';
import {
  getGradient,
  lineChart,
  tooltip,
} from '../../utils/Color';
import {
  getDayLabels,
  getLastEightDays,
  getWeekLabels,
  getWeeksOfMonth,
  getMonthLabels,
  getMonthsOfYear
} from '../../utils/Date';

// retrieves expenses for each period from timePeriod[i] to timePeriod[i + 1]
async function getExpenses(timePeriod) {
  let data = [], i;
  for (i = 0; i < timePeriod.length - 1; i++) {
    await axios.get('api/transactions/summary', {
      params: {
        type: 'expenses',
        start: timePeriod[i],
        end: timePeriod[i + 1]
      }
    })
      .then(res => {
        let expenses = Math.abs(res.data.summary.sum);
        data.push(expenses);
      })
      .catch(error => console.log(error));
  }
  return data;
}

class LineChart extends Component {
  state = {
    chart: null,
    weekExpenses: [],
    monthExpenses: [],
    yearExpenses: [],
    weekLabels: getDayLabels(),
    monthLabels: getWeekLabels(),
    yearLabels: getMonthLabels(),
  };

  componentDidMount() {
    getExpenses(getLastEightDays())
      .then(data =>
        this.setState(
          currentState => {
            currentState.weekExpenses = data;
            return currentState;
          },
          () => this.displayChart('week')
        )
      )
      .catch(error => console.log(error));
    getExpenses(getWeeksOfMonth())
      .then(data =>
        this.setState(currentState => {
          currentState.monthExpenses = data;
          return currentState;
        })
      )
      .catch(error => console.log(error));
    getExpenses(getMonthsOfYear())
      .then(data =>
        this.setState(currentState => {
          currentState.yearExpenses = data;
          return currentState;
        })
      )
      .catch(error => console.log(error));
  }

  // handler for button onClick: updates which chart is displayed
  handleClick = e => {
    e.preventDefault();
    this.displayChart(e.target.name);
  };

  // retrieves (meta)data for chart, then creates and renders chart
  displayChart(name) {
    if (this.state.chart) this.state.chart.destroy();

    let xLabels = [], data = [];
    if (name === 'week') {
      xLabels = this.state.weekLabels;
      data = this.state.weekExpenses;
    } else if (name === 'month') {
      xLabels = this.state.monthLabels;
      data = this.state.monthExpenses;
    } else if (name === 'year') {
      xLabels = this.state.yearLabels;
      data = this.state.yearExpenses;
    }

    this._renderLineChart(xLabels, data);
  }

  // helper that creates and renders line chart, given x-axis labels and data
  _renderLineChart(xLabels, data) {
    const ctx = document.getElementById('chart').getContext('2d');
    const gradientStroke = getGradient(
      ctx,
      lineChart.strokeColor1,
      lineChart.strokeColor2,
      300, 0, 100, 0
    );
    const gradientFill = getGradient(
      ctx,
      lineChart.fillColor1,
      lineChart.fillColor2,
      300, 0, 100, 0
    );

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xLabels,
        datasets: [
          {
            backgroundColor: gradientFill,
            borderColor: gradientStroke,
            data: data,
            pointBackgroundColor: gradientStroke,
          }
        ]
      },
      options: {
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
            display: false,
            gridLines: {
              display: false,
              drawBorder: false,
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
      },
    });
    this.setState({ chart: chart });
  }

  render() {
    return (
      <Col
        sm={{ span: 24 }}
        md={{ span: 20 }}
        lg={{ span: 14 }}
        xl={{ span: 12 }}
      >
        <Card className="lineChart">
          <Row>
            <Col span={8}>
              <Typography.Title level={2} className="chartHeader">
                Expenses
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
          <Row>
            <canvas id="chart" />
          </Row>
        </Card>
      </Col>
    )
  }
}

export default LineChart;