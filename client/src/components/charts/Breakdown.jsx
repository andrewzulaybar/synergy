import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { data, options, getWeekBreakdown, getMonthBreakdown, getYearBreakdown } from '../../utils/charts/breakdown';
import './Breakdown.css';

const Breakdown = props => {
  const [chartType, setChartType] = useState('week');
  const [weekBreakdown, setWeekBreakdown] = useState([]);
  const [monthBreakdown, setMonthBreakdown] = useState([]);
  const [yearBreakdown, setYearBreakdown] = useState([]);
  const [weekLabels, setWeekLabels] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [yearLabels, setYearLabels] = useState([]);

  const { finishedLoading } = props;

  useEffect(() => {
    retrieveBreakdown().then(() => finishedLoading());
  }, []);

  // retrieve weekly, monthly, and yearly expenses
  async function retrieveBreakdown() {
    const promises = [getWeekBreakdown(), getMonthBreakdown(), getYearBreakdown()];
    const [week, month, year] = await Promise.all(promises);

    setWeekBreakdown(week.expenses);
    setWeekLabels(week.labels);
    setMonthBreakdown(month.expenses);
    setMonthLabels(month.labels);
    setYearBreakdown(year.expenses);
    setYearLabels(year.labels);
  }

  // retrieves chart data according to given type
  function getData(type) {
    if (type === 'week')
      return data(weekLabels, weekBreakdown);
    else if (type === 'month')
      return data(monthLabels, monthBreakdown);
    else if (type === 'year')
      return data(yearLabels, yearBreakdown);
  }

  // updates which chart is displayed
  function handleClick(e) {
    e.preventDefault();
    const type = e.target.name;
    setChartType(type);
  }

  const chartData = getData(chartType);

  const header = (
    <Row>
      <Col span={8} align="left">
        <Typography.Title level={2} className="chartHeader">
          Breakdown
        </Typography.Title>
      </Col>
      <Col span={16} align="right" className="buttonGroup">
        <Button.Group size="small">
          <Button onClick={handleClick} name="week">Week</Button>
          <Button onClick={handleClick} name="month">Month</Button>
          <Button onClick={handleClick} name="year">Year</Button>
        </Button.Group>
      </Col>
    </Row>
  );

  return (
    <Col {...props.span}>
      <Card className="doughnutChart" title={header} bordered={false}>
        {props.isLoading
          ? <Skeleton active paragraph={{ rows: 6 }} />
          : <Doughnut data={chartData} options={options} redraw />
        }
      </Card>
    </Col>
  );
};

export default Breakdown;