import { Card, Col, Skeleton } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import ChartHeader from "./ChartHeader";
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

  // data for the current chart type
  const chartData = useMemo(() => {
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
  }, [chartType, state]);

  // updates which chart is displayed
  const handleClick = useCallback((e) => {
    e.preventDefault();
    const type = e.target.name;
    setChartType(type);
  }, [setChartType]);

  return (
    <Col {...{xs: 24, lg: 12}}>
      <Card
        className="doughnutChart"
        title={<ChartHeader title="Breakdown" onClick={handleClick} />}
        bordered={false}
      >
        {homeState.isLoading
          ? <Skeleton active paragraph={{rows: 6}}/>
          : <Doughnut data={chartData} options={options} redraw />
        }
      </Card>
    </Col>
  );
};

export default memo(Breakdown);