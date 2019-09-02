import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';

import { HomeContext } from '../stores/HomeProvider';
import { FINISHED_LOADING } from '../../utils/misc/action-types';
import { getDayLabels, getWeekLabels, getMonthLabels } from '../../utils/misc/date';
import { data, options, getWeekExpenses, getMonthExpenses, getYearExpenses } from '../../utils/charts/expenses';
import './Expenses.css';

const Expenses = ({ span }) => {
  const [chartType, setChartType] = useState('week');
  const [state, setState] =
    useState({
      weekExpenses: [],
      weekLabels: getDayLabels(),
      monthExpenses: [],
      monthLabels: getWeekLabels(),
      yearExpenses: [],
      yearLabels: getMonthLabels(),
    });

  const { state: homeState, dispatch: homeDispatch } = useContext(HomeContext);

  // retrieves expenses if component did mount
  useEffect(() => {
    retrieveExpenses().then(() => homeDispatch({ type: FINISHED_LOADING }))
  }, []);

  // retrieve weekly, monthly, and yearly expenses
  async function retrieveExpenses() {
    const promises = [getWeekExpenses(), getMonthExpenses(), getYearExpenses()];
    const [week, month, year] = await Promise.all(promises);
    setState({
      ...state,
      weekExpenses: week,
      monthExpenses: month,
      yearExpenses: year,
    })
  }

  // retrieves chart data according to given type
  function getData(type) {
    if (type === 'week')
      return data(state.weekLabels, state.weekExpenses);
    else if (type === 'month')
      return data(state.monthLabels, state.monthExpenses);
    else if (type === 'year')
      return data(state.yearLabels, state.yearExpenses);
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
    <Col {...span}>
      <Card className="lineChart" title={header} bordered={false}>
        {homeState.isLoading
          ? <Skeleton active paragraph={{ rows: 6 }}/>
          : <Line data={chartData} options={options} redraw />
        }
      </Card>
    </Col>
  )
};

export default Expenses;