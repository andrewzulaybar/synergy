import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import {
  getDayLabels,
  getWeekLabels,
  getMonthLabels,
  getLastSevenDays,
  getLastFiveWeeks,
  getLastTwelveMonths
} from '../../utils/misc/date';
import { data, options, getExpenses } from '../../utils/charts/expenses';
import './Expenses.css';

class Expenses extends Component {
  __isMounted = true;

  chartRef = {};

  state = {
    chartType: 'week',
    weekExpenses: [],
    monthExpenses: [],
    yearExpenses: [],
    weekLabels: getDayLabels(),
    monthLabels: getWeekLabels(),
    yearLabels: getMonthLabels(),
  };

  componentDidMount() {
    this.retrieveExpenses()
      .then(() => this.props.finishedLoading())
      .catch(error => console.log(error));
    this.props.onUpdate(this.onUpdate);
  }

  componentWillUnmount() {
    this.__isMounted = false;
  }

  // retrieves expenses on update
  onUpdate = () => {
    this.retrieveExpenses()
      .catch(error => console.log(error));
  };

  // retrieve weekly, monthly, and yearly expenses
  async retrieveExpenses() {
    const week = this.getWeekExpenses();
    const month = this.getMonthExpenses();
    const year = this.getYearExpenses();

    await week;
    await month;
    await year;
  };

  // retrieves expenses for past week from API
  getWeekExpenses() {
    const lastEightDays = getLastSevenDays();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    lastEightDays.push(tomorrow);
    return getExpenses(lastEightDays)
      .then(data => this.updateWeekExpenses(data))
      .catch(error => console.log(error));
  }

  // updates state with week expenses
  updateWeekExpenses(data) {
    if (this.__isMounted) {
      this.setState(currentState => {
        currentState.weekExpenses = data;
        return currentState;
      });
    }
  };

  // retrieves expenses for past month from API
  getMonthExpenses() {
    const lastSixWeeks = getLastFiveWeeks();
    const date = new Date();
    date.setDate(date.getDate() + 1);
    lastSixWeeks.push(date);
    return getExpenses(lastSixWeeks)
      .then(data => this.updateMonthExpenses(data))
      .catch(error => console.log(error));
  }

  // updates state with month expenses
  updateMonthExpenses(data) {
    if (this.__isMounted) {
      this.setState(currentState => {
        currentState.monthExpenses = data;
        return currentState;
      })
    }
  };

  // retrieves expenses for past year from API
  getYearExpenses() {
    const lastThirteenMonths = getLastTwelveMonths();
    const nextMonth = new Date();
    nextMonth.setFullYear(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
    lastThirteenMonths.push(nextMonth);
    return getExpenses(lastThirteenMonths)
      .then(data => this.updateYearExpenses(data))
      .catch(error => console.log(error));
  }

  // updates state with yearly expenses
  updateYearExpenses(data) {
    if (this.__isMounted) {
      this.setState(currentState => {
        currentState.yearExpenses = data;
        return currentState;
      })
    }
  };

  // retrieves chart data according to given type
  getData(type) {
    if (type === 'week')
      return data(this.state.weekLabels, this.state.weekExpenses);
    else if (type === 'month')
      return data(this.state.monthLabels, this.state.monthExpenses);
    else if (type === 'year')
      return data(this.state.yearLabels, this.state.yearExpenses);
  };

  // updates which chart is displayed
  handleClick = e => {
    e.preventDefault();
    const type = e.target.name;
    if (this.__isMounted)
      this.setState({ chartType: type });
  };

  render() {
    const data = this.getData(this.state.chartType);

    const header = (
      <Row>
        <Col span={8} align="left">
          <Typography.Title level={2} className="chartHeader">
            Expenses
          </Typography.Title>
        </Col>
        <Col span={16} align="right" className="buttonGroup">
          <Button.Group size="small">
            <Button onClick={this.handleClick} name="week">Week</Button>
            <Button onClick={this.handleClick} name="month">Month</Button>
            <Button onClick={this.handleClick} name="year">Year</Button>
          </Button.Group>
        </Col>
      </Row>
    );

    return (
      <Col {...this.props.span}>
        <Card className="lineChart" title={header} bordered={false}>
          {this.props.isLoading
            ? <Skeleton active paragraph={{ rows: 6 }}/>
            : <Line
                data={data}
                options={options}
                redraw
                ref={ref => this.chartRef = ref}
              />
          }
        </Card>
      </Col>
    )
  }
}

export default Expenses;