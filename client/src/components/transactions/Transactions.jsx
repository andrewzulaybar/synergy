import { Col, Row, Table, Tag, Typography } from 'antd';
import { green, red } from '@ant-design/colors';
import axios from "axios";
import React, { Component } from 'react';

import '../Transactions.css'

const schema = [
    'Amount',
    'Description',
    'Method',
    'Tags',
    'Date'
];

const tagColors = {
    'clothes': 'blue',
    'income': 'green',
    'restaurants': 'red',
    'skincare': 'yellow',
    'travel': 'orange',
};

const columns = [
    {
        title: schema[0],
        dataIndex: schema[0].toLowerCase(),
        key: schema[0].toLowerCase(),
        render: amount => {
            if (amount < 0) {
                return (
                    <div style={{ color: red[4] }}>
                        - ${-amount}
                    </div>
                );
            } else {
                return (
                    <div style={{ color: green[3] }}>
                        + ${amount}
                    </div>
                );
            }
        }
    },
    {
        title: schema[1],
        dataIndex: schema[1].toLowerCase(),
        key: schema[1].toLowerCase(),
    },
    {
        title: schema[2],
        dataIndex: schema[2].toLowerCase(),
        key: schema[2].toLowerCase(),
    },
    {
        title: schema[3],
        key: schema[3].toLowerCase(),
        dataIndex: schema[3].toLowerCase(),
        render: tags => (
            <span>
                {tags.map(tag => {
                    let color = tagColors[tag];
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </span>
        ),
    },
    {
        title: schema[4],
        dataIndex: schema[4].toLowerCase(),
        key: schema[4].toLowerCase(),
    },
];

const transactions = [
    {
        id: 1,
        amount: '-20',
        description: 'H&M',
        method: 'Cash',
        tags: ['clothes'],
        date: 'Jan 20, 2019'
    },
    {
        id: 2,
        amount: '200',
        description: 'Work',
        method: 'Debit',
        tags: ['income'],
        date: 'Mar 29, 2019'
    },
    {
        id: 3,
        amount: '-50',
        description: 'Food',
        method: 'Mastercard',
        tags: ['restaurants'],
        date: 'Apr 20, 2019'
    },
    {
        id: 4,
        amount: '-8',
        description: 'Origins',
        method: 'Cash',
        tags: ['skincare', 'travel'],
        date: 'Dec 17, 2018'
    },
];

class Transactions extends Component {
    state = {
        isConnected: false
    };

    // call back-end API to retrieve data
    componentDidMount() {
        axios.get('/api')
            .then(res => {
                this.setState({
                    isConnected: res.data.isConnected,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { transactionSpan } = this.props;

        return (
            <Row type="flex" justify="center">
                <Col className="transactions-list" span={transactionSpan}>
                    <Typography.Title level={2}>
                        Transactions
                    </Typography.Title>
                    <Table
                        className="transactions"
                        columns={columns}
                        dataSource={transactions}
                        pagination={false}
                        rowKey={(record) => {
                            return record.id;
                        }}
                    />
                </Col>
            </Row>
        );
    }
}

export default Transactions;