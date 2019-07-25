import { Button, Card, Col, Row, Typography } from 'antd';
import axios from 'axios';
import Chart from "chart.js";
import React, { Component } from 'react';

import './LineGraph.css';
import { getDaysOfWeek, getLastEightDays } from '../../utils/Date';


function getGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(300, 0, 100, 0);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

class LineGraph extends Component {
  isDataReady = false;

  componentDidMount() {
    const week = getLastEightDays();
    const xLabels = getDaysOfWeek();
    this._getWeekExpenses(week)
      .then(data =>
        this._renderLineGraph(xLabels, data)
      )
      .catch(error => console.log(error));
  }

  // polls until data is ready, then updates chart
  _checkDataIsReady(chart) {
    if (!this.isDataReady)
      window.setTimeout(this._checkDataIsReady, 1000, chart);
    else
      chart.update();
  }

  // retrieves daily expenses for the given week
  async _getWeekExpenses(week) {
    let data = [], i;
    for (i = 0; i < week.length - 1; i++) {
      await axios.get('api/transactions/summary', {
        params: {
          type: 'expenses',
          start: week[i],
          end: week[i + 1]
        }
      })
        .then(res => {
          let dailyExpenses = Math.abs(res.data.summary.sum);
          data.push(dailyExpenses);
          if (data.length === 7) this.isDataReady = true;
        })
        .catch(error => console.log(error));
    }
    return data;
  }

  // creates line graph
  _renderLineGraph(xLabels, data) {
    const ctx = this.node.getContext('2d');
    const gradientStroke = getGradient(ctx,'#80b6f4','#f49080');
    const gradientFill = getGradient(ctx, 'rgba(128, 182, 244, 0.4)', 'rgba(244, 144, 128, 0.4)');
    const tooltipBackgroundColor = '#e7e7e7';
    const tooltipTextColor = 'rgba(51, 51, 51, 0.75)';

    const graph = new Chart(this.node, {
      type: "line",
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
          backgroundColor: tooltipBackgroundColor,
          bodyAlign: 'center',
          bodyFontColor: tooltipTextColor,
          callbacks: {
            label: (tooltip, object) => {
              const yLabel = object.datasets[tooltip.datasetIndex].data[tooltip.index];
              return '$ ' + yLabel;
            }
          },
          displayColors: false,
          intersect: false,
          titleAlign: 'center',
          titleFontColor: tooltipTextColor,
          xAlign: 'center',
          yAlign: 'bottom',
        }
      }
    });
    this._checkDataIsReady(graph);
  }

  render() {
    return (
      <Card className="lineGraph">
        <Row>
          <Col span={8}>
            <Typography.Title level={2}>
              Expenses
            </Typography.Title>
          </Col>
          <Col span={16} align="right" id="buttonGroup">
            <Button.Group>
              <Button>Week</Button>
              <Button>Month</Button>
              <Button>Year</Button>
            </Button.Group>
          </Col>
        </Row>
        <Row>
          <canvas id="myChart" ref={node => this.node = node} />
        </Row>
      </Card>
    )
  }
}

export default LineGraph;