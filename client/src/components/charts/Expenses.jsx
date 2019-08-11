import { Col, Row, Skeleton } from 'antd';
import axios from "axios";
import Chart from 'chart.js';
import React, { Component } from 'react';

import BaseChart from './Chart';
import { TransactionsContext } from "../transactions/Provider";
import { lineChart, tooltip } from '../../utils/color';
import {getDayLabels, getWeekLabels, getMonthLabels, formatDate} from '../../utils/date';
import '../../screens/home/Home.css';

class Expenses extends Component {
  state = {
    weekExpenses: [],
    monthExpenses: [],
    yearExpenses: [],
    weekLabels: getDayLabels(),
    monthLabels: getWeekLabels(),
    yearLabels: getMonthLabels(),
  };

  // retrieves (meta)data for chart, then creates and renders chart
  displayChart = name => {
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

    return new Chart(
      document.getElementById('lineChart').getContext('2d'),
      {
        type: 'line',
        data: {
          labels: xLabels,
          datasets: [
            {
              backgroundColor: lineChart.fillColor,
              borderColor: lineChart.strokeColor,
              data: data,
              pointBackgroundColor: lineChart.strokeColor,
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
        },
      }
    );
  };

  // retrieves expenses for each period from timePeriod[i] to timePeriod[i + 1]
  async getExpenses(timePeriod) {
    let data = [], i;
    for (i = 0; i < timePeriod.length - 1; i++) {
      await axios.get('api/transactions/summary', {
        params: {
          type: 'expenses',
          start: formatDate(timePeriod[i]),
          end: formatDate(timePeriod[i + 1])
        }
      })
        .then(res => data.push(Math.abs(res.data.summary.sum).toFixed(2)))
        .catch(error => console.log(error));
    }
    return data;
  };

  // callback function called after weekly expenses have been retrieved
  weekCallback = data => {
    this.setState(currentState => {
      currentState.weekExpenses = data;
      return currentState;
    });
  };

  // callback function called after monthly expenses have been retrieved
  monthCallback = data => {
    this.setState(currentState => {
      currentState.monthExpenses = data;
      return currentState;
    })
  };

  // callback function called after yearly expenses have been retrieved
  yearCallback = data => {
    this.setState(currentState => {
      currentState.yearExpenses = data;
      return currentState;
    })
  };

  render() {
    return (
      <Col {...this.props.span}>
        <TransactionsContext.Consumer>
          {context =>
            <BaseChart
              name="lineChart"
              title="Expenses"
              subject={context.subject}
              displayChart={this.displayChart}
              getExpenses={this.getExpenses}
              weekCallback={this.weekCallback}
              monthCallback={this.monthCallback}
              yearCallback={this.yearCallback}
            >
              {(this.state.weekExpenses.length === 0 || this.state.weekLabels.length === 0)
                ? <Skeleton active paragraph={{rows: 6}}/>
                : <Row>
                    <canvas id="lineChart"/>
                  </Row>}
            </BaseChart>
          }
        </TransactionsContext.Consumer>
      </Col>
    )
  }
}

export default Expenses;