import { Card, Col, Icon, Row, Skeleton } from 'antd';
import { gold, green, red } from '@ant-design/colors';
import React from 'react';

import './Summary.css';

const Summary = ({ amount, percent, title, isLoading }) => {
  let icon, styles;
  if (percent) {
    if (percent > 0) {
      styles = { color: green[3] };
      icon = <Icon type="caret-up" style={styles} />;
    } else if (percent === 0) {
      styles = { color: gold[3] };
      icon = <Icon type="swap" style={styles} />;
    } else {
      styles = { color: red[4] };
      icon = <Icon type="caret-down" style={styles} />;
      percent = -percent;
    }
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
                {icon}
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