import { Button, Card, Col, Row, Typography } from 'antd';
import React, { Component } from 'react';

import { getLastFiveWeeks, getLastSevenDays, getLastTwelveMonths } from '../../utils/date';

class Chart extends Component {
  state = {
    chart: null,
    chartType: null,
  };

  componentDidMount() {
    const { subject } = this.props;
    subject.addObserver(this);
    this.setState(
      { chartType: 'week' },
      () => this.update()
    );
  }

  // called when transactions have been updated: re-renders chart
  update = () => {
    this.retrieveExpenses()
      .then(() => this.setChartState(this.state.chartType))
      .catch(error => console.log(error));
  };

  // retrieve weekly, monthly, and yearly expenses
  async retrieveExpenses() {
    const { getExpenses, weekCallback, monthCallback, yearCallback } = this.props;

    const week = this.getWeeklyExpenses(getExpenses, weekCallback);
    const month = this.getMonthlyExpenses(getExpenses, monthCallback);
    const year = this.getYearlyExpenses(getExpenses, yearCallback);

    await week;
    await month;
    await year;
  }

  // retrieves expenses for past week from API
  getWeeklyExpenses(getExpenses, callback) {
    const lastEightDays = getLastSevenDays();
    lastEightDays.push(
      (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      })()
    );
    return getExpenses(lastEightDays)
      .then(data => callback(data))
      .catch(error => console.log(error));
  }

  // retrieves expenses for past month from API
  getMonthlyExpenses(getExpenses, callback) {
    const lastSixWeeks = getLastFiveWeeks();
    const date = new Date();
    date.setDate(date.getDate() + 1);
    lastSixWeeks.push(date);
    return getExpenses(lastSixWeeks)
      .then(data => callback(data))
      .catch(error => console.log(error));
  }

  // retrieves expenses for past year from API
  getYearlyExpenses(getExpenses, callback) {
    const lastThirteenMonths = getLastTwelveMonths();
    lastThirteenMonths.push(
      (() => {
        const nextMonth = new Date();
        nextMonth.setFullYear(
          nextMonth.getFullYear(),
          nextMonth.getMonth() + 1,
          1
        );
        return nextMonth;
      })()
    );
    return getExpenses(lastThirteenMonths)
      .then(data => callback(data))
      .catch(error => console.log(error));
  }

  // handler for button onClick: updates which chart is displayed
  handleClick = e => {
    e.preventDefault();
    const type = e.target.name;
    this.setState({ chartType: type });
    this.setChartState(type);
  };

  // syncs up state with current chart
  setChartState = type => {
    if (this.state.chart)
      this.state.chart.destroy();
    this.setState({
      chart: this.props.displayChart(type)
    });
  };

  render() {
    const header = (
      <Row>
        <Col span={8} align="left">
          <Typography.Title level={2} className="chartHeader">
            {this.props.title}
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
      <Card className={this.props.name} title={header} bordered={false}>
        {this.props.children}
      </Card>
    );
  }
}

export default Chart;