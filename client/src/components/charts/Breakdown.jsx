import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { HomeContext } from '../stores/HomeProvider';
import { FINISHED_LOADING } from '../../utils/misc/action-types';
import { data, options, getWeekBreakdown, getMonthBreakdown, getYearBreakdown } from '../../utils/charts/breakdown';
import './Breakdown.css';

const Breakdown = ({ span }) => {
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

  // retrieves breakdown if component did mount
  useEffect(() => {
    retrieveBreakdown().then(() => homeDispatch({ type: FINISHED_LOADING }));
  }, []);

  // retrieve weekly, monthly, and yearly expenses
  async function retrieveBreakdown() {
    const promises = [getWeekBreakdown(), getMonthBreakdown(), getYearBreakdown()];
    const [week, month, year] = await Promise.all(promises);
    setState({
      weekBreakdown: week.expenses,
      weekLabels: week.labels,
      monthBreakdown: month.expenses,
      monthLabels: month.labels,
      yearBreakdown: year.expenses,
      yearLabels: year.labels,
    });
  }

  // retrieves chart data according to given type
  function getData(type) {
    if (type === 'week')
      return data(state.weekLabels, state.weekBreakdown);
    else if (type === 'month')
      return data(state.monthLabels, state.monthBreakdown);
    else if (type === 'year')
      return data(state.yearLabels, state.yearBreakdown);
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
    <Col {...span}>
      <Card className="doughnutChart" title={header} bordered={false}>
        {homeState.isLoading
          ? <Skeleton active paragraph={{ rows: 6 }} />
          : <Doughnut data={chartData} options={options} redraw />
        }
      </Card>
    </Col>
  );
};

export default Breakdown;