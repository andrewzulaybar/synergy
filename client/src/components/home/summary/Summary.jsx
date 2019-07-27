import { Card, Col, Icon, Row } from "antd";
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
                    style={{ fontSize: 24 }}
                />
            );
            styles = { color: green[3] };
        } else if (percent === 0) {
            icon = (
                <Icon
                    type="swap"
                    style={{ fontSize: 20, marginTop: 2 }}
                />
            );
            styles = { color: gold[3] };
        } else {
            icon = (
                <Icon
                    type="caret-down"
                    style={{ fontSize: 24 }}
                />
            );
            styles = { color: red[4] };
            percent = -percent;
        }

        return (
            <Col
                className="card-column"
                xs={{span: 24}}
                sm={{span: 16}}
                md={{span: 12}}
                lg={{span: 6}}
            >
                <Card size="small" hoverable>
                    <Col span={24}>
                        <h4 className="title">{title}</h4>
                        <h1 className="amount">${amount}</h1>
                    </Col>
                    <Col span={24} style={styles}>
                        <Row type="flex" justify="center">
                            {icon}
                            <h4 className="percent" style={styles}>{percent} %</h4>
                        </Row>
                    </Col>
                </Card>
            </Col>
        );
    }
}

export default Summary;