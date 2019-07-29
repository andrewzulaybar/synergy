import { Card, Col, Icon, Row } from "antd";
import { gold, green, red } from '@ant-design/colors';
import React, { Component } from 'react';

import './Home.css';

class Summary extends Component {
  render() {
    let { amount, percent, title } = this.props;

    let icon, styles;
    if (percent > 0) {
      icon = (
        <Icon
          type="caret-up"
          style={{ fontSize: 16 }}
        />
      );
      styles = { color: green[3] };
    } else if (percent === 0) {
      icon = (
        <Icon
          type="swap"
          style={{ fontSize: 16}}
        />
      );
      styles = { color: gold[3] };
    } else {
      icon = (
        <Icon
          type="caret-down"
          style={{ fontSize: 16 }}
        />
      );
      styles = { color: red[4] };
      percent = -percent;
    }

    return (
      <Col
        className="summary"
        xs={{span: 24}}
        sm={{span: 16}}
        md={{span: 12}}
        lg={{span: 6}}
      >
        <Card size="small" bordered={false}>
          <Row>
            <Col span={24}>
              <h4 className="title">{title}</h4>
              <h1 className="amount">$ {amount}</h1>
            </Col>
          </Row>
          <Row>
            <Col span={2} style={styles}>
              {icon}
            </Col>
            <h4 className="percent" style={styles}>{percent} %</h4>
          </Row>
        </Card>
      </Col>
    );
  }
}

export default Summary;