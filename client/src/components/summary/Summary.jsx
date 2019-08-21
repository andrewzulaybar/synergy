import { Card, Col, Icon, Row, Skeleton } from 'antd';
import { gold, green, red } from '@ant-design/colors';
import React, { Component } from 'react';

import './Summary.css';

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
      <Col className="summary" {...{ xs: 24, sm: 8 }}>
        <Card size="small" bordered={false}>
          {!this.props.loading
            ? <>
                <Row>
                  <Col span={24}>
                    <h4 className="title">{title}</h4>
                    <h1 className="amount">$ {amount}</h1>
                  </Col>
                </Row>
                {this.props.percent &&
                  <Row>
                    <Col span={2} style={styles}>{icon}</Col>
                    <h4 className="percent" style={styles}>{percent} %</h4>
                  </Row>
                }
              </>
            : <Skeleton active paragraph={{ rows: 1 }} />
          }
        </Card>
      </Col>
    );
  }
}

export default Summary;