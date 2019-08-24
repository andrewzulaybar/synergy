import { Button, Card, Col, Row, Skeleton, Typography } from 'antd';
import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { data, options, getWeekBreakdown, getMonthBreakdown, getYearBreakdown } from '../../utils/charts/breakdown';
import './Breakdown.css';

class Breakdown extends Component {
  __isMounted = true;

  chartRef = {};

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

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.isLoading !== this.props.isLoading)
      return true;

    return nextState !== this.state;
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
    const promises = [getWeekBreakdown(), getMonthBreakdown(), getYearBreakdown()];
    const [week, month, year] = await Promise.all(promises);

    if (this.__isMounted) {
      this.setState({
        weekBreakdown: week.expenses,
        weekLabels: week.labels,
        monthBreakdown: month.expenses,
        monthLabels: month.labels,
        yearBreakdown: year.expenses,
        yearLabels: year.labels,
      })
    }
  }

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