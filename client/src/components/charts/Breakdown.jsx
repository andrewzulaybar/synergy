import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { data, options, retrieveData } from '../../utils/charts/breakdown';
import './Breakdown.css';

class Breakdown extends Component {
  __isMounted = true;

  chartRef = {};
  numOfTags = 5;

  state = {
    chartType: 'week',
    weekBreakdown: [],
    monthBreakdown: [],
    yearBreakdown: [],
    weekLabels: [],
    monthLabels: [],
    yearLabels: [],
  };

  componentDidMount() {
    this.retrieveBreakdown()
      .then(() => this.props.finishedLoading())
      .catch(error => console.log(error));
    this.props.onUpdate(this.onUpdate);
  }

  componentWillUnmount() {
    this.__isMounted = false;
  }

  // retrieves breakdown on update
  onUpdate = () => {
    this.retrieveBreakdown()
      .catch(error => console.log(error));
  };

  // retrieve weekly, monthly, and yearly expenses
  async retrieveBreakdown() {
    const week = this.getWeekBreakdown();
    const month = this.getMonthBreakdown();
    const year = this.getYearBreakdown();

    await week;
    await month;
    await year;
  }

  // retrieves expenses for past week from API
  getWeekBreakdown() {
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return retrieveData(sixDaysAgo, tomorrow, this.numOfTags)
      .then(data => this.updateWeekBreakdown(data))
      .catch(error => console.log(error));
  }

  // updates state with week expenses
  updateWeekBreakdown(data) {
    if (this.__isMounted) {
      this.setState(currentState => {
        currentState.weekBreakdown = data[0];
        currentState.weekLabels = data[1];
        return currentState;
      });
    }
  };

  // retrieves expenses for past month from API
  getMonthBreakdown() {
    const fiveWeeksAgo = new Date();
    fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 5 * 7);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return retrieveData(fiveWeeksAgo, tomorrow, this.numOfTags)
      .then(data => this.updateMonthBreakdown(data))
      .catch(error => console.log(error));
  }

  // updates state with month expenses
  updateMonthBreakdown(data) {
    if (this.__isMounted) {
      this.setState(currentState => {
        currentState.monthBreakdown = data[0];
        currentState.monthLabels = data[1];
        return currentState;
      })
    }
  };

  // retrieves expenses for past year from API
  getYearBreakdown() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    const nextMonth = new Date();
    nextMonth.setFullYear(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);

    return retrieveData(twelveMonthsAgo, nextMonth, this.numOfTags)
      .then(data => this.updateYearBreakdown(data))
      .catch(error => console.log(error));
  }

  // updates state with year expenses
  updateYearBreakdown(data) {
    if (this.__isMounted) {
      this.setState(currentState => {
        currentState.yearBreakdown = data[0];
        currentState.yearLabels = data[1];
        return currentState;
      })
    }
  };

  // retrieves chart data according to given type
  getData(type) {
    if (type === 'week')
      return data(this.state.weekLabels, this.state.weekBreakdown);
    else if (type === 'month')
      return data(this.state.monthLabels, this.state.monthBreakdown);
    else if (type === 'year')
      return data(this.state.yearLabels, this.state.yearBreakdown);
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
            Breakdown
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
        <Card className="doughnutChart" title={header} bordered={false}>
          {this.props.isLoading
            ? <Skeleton active paragraph={{ rows: 6 }} />
            : <Doughnut
                data={data}
                options={options}
                redraw
                ref={ref => this.chartRef = ref}
              />
          }
        </Card>
      </Col>
    );
  }
}

export default Breakdown;