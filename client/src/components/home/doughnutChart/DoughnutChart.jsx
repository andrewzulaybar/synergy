import { Button, Card, Col, Row, Typography } from 'antd';
import Chart from 'chart.js';
import React, { Component } from 'react';

import { tooltip } from '../../../utils/Color';
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

// formats tooltip title
function formatTooltipTitle(tooltipArray, object) {
  return object.labels[tooltipArray[0].index] + ':';
}

class DoughnutChart extends Component {
  componentDidMount() {
    const labels = [
      'Coffee',
      'Drink',
      'Clothes',
      'Restaurants',
      'Movies',
      'Other',
    ];
    const data = [10, 20, 30, 40, 50, 60].reverse();
    this.displayChart(labels, data);
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