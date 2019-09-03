import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { HomeContext } from '../stores/HomeProvider';
import {TransactionsContext} from '../stores/TransactionsProvider';
import { FINISHED_LOADING } from '../../utils/misc/action-types';
import { getDayLabels, getWeekLabels, getMonthLabels } from '../../utils/misc/date';
import { data, options, retrieveExpenses } from '../../utils/charts/expenses';
import './Expenses.css';

const Expenses = () => {
  const [chartType, setChartType] = useState('week');
  const [state, setState] =
    useState({
      weekExpenses: [],
      weekLabels: [],
      monthExpenses: [],
      monthLabels: [],
      yearExpenses: [],
      yearLabels: [],
    });

  const { state: homeState, dispatch: homeDispatch } = useContext(HomeContext);
  const { state: transactionsState } = useContext(TransactionsContext);

  // retrieves expenses if component did mount
  useEffect(() => {
    retrieveExpenses().then(([week, month, year]) => {
      setState({
        weekLabels: getDayLabels(),
        monthLabels: getWeekLabels(),
        yearLabels: getMonthLabels(),
        weekExpenses: week,
        monthExpenses: month,
        yearExpenses: year,
      });
      homeDispatch({ type: FINISHED_LOADING });
    });
  }, [homeDispatch]);

  // retrieves expenses if transactions have changed
  useEffect(() => {
    retrieveExpenses().then(([week, month, year]) => {
      setState({
        weekLabels: getDayLabels(),
        monthLabels: getWeekLabels(),
        yearLabels: getMonthLabels(),
        weekExpenses: week,
        monthExpenses: month,
        yearExpenses: year,
      });
    });
  }, [transactionsState]);

  // updates which chart is displayed
  function handleClick (e) {
    e.preventDefault();
    const type = e.target.name;
    setChartType(type);
  }

  return useMemo(() => {
    const chartData = (() => {
      switch (chartType) {
        case 'week':
          return data(state.weekLabels, state.weekExpenses);
        case 'month':
          return data(state.monthLabels, state.monthExpenses);
        case 'year':
          return data(state.yearLabels, state.yearExpenses);
        default:
          return [];
      }
    })();

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
      <Col {...{xs: 24, lg: 12}}>
        <Card className="lineChart" title={header} bordered={false}>
          {homeState.isLoading
            ? <Skeleton active paragraph={{rows: 6}}/>
            : <Line data={chartData} options={options} redraw/>
          }
        </Card>
      </Col>
    );
  }, [state, chartType, homeState.isLoading])
};

export default Expenses;