import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { HomeContext } from '../stores/HomeProvider';
import { TransactionsContext } from '../stores/TransactionsProvider';
import { FINISHED_LOADING } from '../../utils/misc/action-types';
import { data, options, retrieveBreakdown } from '../../utils/charts/breakdown';
import './Breakdown.css';

const Breakdown = () => {
  const [chartType, setChartType] = useState('week');
  const [state, setState] =
    useState({
      weekBreakdown: [],
      weekLabels: [],
      monthBreakdown: [],
      monthLabels: [],
      yearBreakdown: [],
      yearLabels: [],
    });

  const { state: homeState, dispatch: homeDispatch } = useContext(HomeContext);
  const { state: transactionsState } = useContext(TransactionsContext);

  // retrieves breakdown if component did mount
  useEffect(() => {
    retrieveBreakdown()
      .then(([week, month, year]) => {
        setState({
          weekBreakdown: week.expenses,
          weekLabels: week.labels,
          monthBreakdown: month.expenses,
          monthLabels: month.labels,
          yearBreakdown: year.expenses,
          yearLabels: year.labels,
        });
        homeDispatch({ type: FINISHED_LOADING })
      });
  }, [homeDispatch]);

  // retrieves breakdown if transactions have changed
  useEffect(() => {
    retrieveBreakdown()
      .then(([week, month, year]) => {
        setState({
          weekBreakdown: week.expenses,
          weekLabels: week.labels,
          monthBreakdown: month.expenses,
          monthLabels: month.labels,
          yearBreakdown: year.expenses,
          yearLabels: year.labels,
        });
      });
  }, [transactionsState]);

  // updates which chart is displayed
  function handleClick(e) {
    e.preventDefault();
    const type = e.target.name;
    setChartType(type);
  }

  return useMemo(() => {
    const chartData = (() => {
      switch (chartType) {
        case 'week':
          return data(state.weekLabels, state.weekBreakdown);
        case 'month':
          return data(state.monthLabels, state.monthBreakdown);
        case 'year':
          return data(state.yearLabels, state.yearBreakdown);
        default:
          return [];
      }
    })();

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
      <Col {...{xs: 24, lg: 12}}>
        <Card className="doughnutChart" title={header} bordered={false}>
          {homeState.isLoading
            ? <Skeleton active paragraph={{rows: 6}}/>
            : <Doughnut data={chartData} options={options} redraw/>
          }
        </Card>
      </Col>
    );
  }, [state, chartType, homeState.isLoading]);
};

export default Breakdown;