import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import { getDayLabels, getWeekLabels, getMonthLabels } from '../../utils/misc/date';
import { data, options, getWeekExpenses, getMonthExpenses, getYearExpenses } from '../../utils/charts/expenses';
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

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.isLoading !== this.props.isLoading)
      return true;

    return nextState !== this.state;
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
    const promises = [getWeekExpenses(), getMonthExpenses(), getYearExpenses()];
    const [week, month, year] = await Promise.all(promises);

    if (this.__isMounted) {
      this.setState({
        weekExpenses: week,
        monthExpenses: month,
        yearExpenses: year,
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