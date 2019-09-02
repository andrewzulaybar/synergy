import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { getDayLabels, getWeekLabels, getMonthLabels } from '../../utils/misc/date';
import { data, options, getWeekExpenses, getMonthExpenses, getYearExpenses } from '../../utils/charts/expenses';
import './Expenses.css';

const Expenses = props => {
  const [chartType, setChartType] = useState('week');
  const [weekExpenses, setWeekExpenses] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [yearExpenses, setYearExpenses] = useState([]);
  const weekLabels = getDayLabels();
  const monthLabels = getWeekLabels();
  const yearLabels =  getMonthLabels();

  const { finishedLoading } = props;

  useEffect(() => {
    retrieveExpenses().then(() => finishedLoading())
  }, []);

  // retrieve weekly, monthly, and yearly expenses
  async function retrieveExpenses() {
    const promises = [getWeekExpenses(), getMonthExpenses(), getYearExpenses()];
    const [week, month, year] = await Promise.all(promises);
    setWeekExpenses(week);
    setMonthExpenses(month);
    setYearExpenses(year);
  }

  // retrieves chart data according to given type
  function getData(type) {
    if (type === 'week')
      return data(weekLabels, weekExpenses);
    else if (type === 'month')
      return data(monthLabels, monthExpenses);
    else if (type === 'year')
      return data(yearLabels, yearExpenses);
  }

  // updates which chart is displayed
  function handleClick (e) {
    e.preventDefault();
    const type = e.target.name;
    setChartType(type);
  }

  const chartData = getData(chartType);

  const header = (
    <Row>
      <Col span={8} align="left">
        <Typography.Title level={2} className="chartHeader">
          Expenses
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
      <Card className="lineChart" title={header} bordered={false}>
        {props.isLoading
          ? <Skeleton active paragraph={{ rows: 6 }}/>
          : <Line data={chartData} options={options} redraw />
        }
      </Card>
    </Col>
  )
};

export default Expenses;