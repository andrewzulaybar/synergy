import { Button, Col, Row, Typography } from 'antd';
import React from 'react';

const ChartHeader = ({ title, onClick}) => {
  return (
    <Row>
      <Col span={8} align="left">
        <Typography.Title level={2} className="chartHeader">
          {title}
        </Typography.Title>
      </Col>
      <Col span={16} align="right" className="buttonGroup">
        <Button.Group size="small">
          <Button onClick={onClick} name="week">Week</Button>
          <Button onClick={onClick} name="month">Month</Button>
          <Button onClick={onClick} name="year">Year</Button>
        </Button.Group>
      </Col>
    </Row>
  )
};

export default React.memo(ChartHeader);