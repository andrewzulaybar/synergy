import { Card, Col, Icon, Row, Skeleton } from 'antd';
import { gold, green, red } from '@ant-design/colors';
import React from 'react';

import './Summary.css';

const Summary = props => {
  let { amount, percent, title, isLoading } = props;

  let icon, styles;
  if (percent > 0) {
    icon = <Icon type="caret-up" />;
    styles = { color: green[3] };
  } else if (percent === 0) {
    icon = <Icon type="swap" />;
    styles = { color: gold[3] };
  } else {
    icon = <Icon type="caret-down" />;
    styles = { color: red[4] };
    percent = -percent;
  }

  return (
    <Col className="summary" {...{ xs: 24, sm: 8 }}>
      <Card size="small" bordered={false}>
        {isLoading
          ? <Skeleton active paragraph={{ rows: 1 }} />
          : <>
            <Row>
              <Col span={24}>
                <h4 className="title">{title}</h4>
                <h1 className="amount">$ {amount}</h1>
              </Col>
            </Row>
            {percent &&
              <Row className="percent-icon">
                <Col span={2} style={styles}>{icon}</Col>
                <h4 className="percent" style={styles}>{percent} %</h4>
              </Row>
            }
          </>
        }
      </Card>
    </Col>
  );
};

export default Summary;