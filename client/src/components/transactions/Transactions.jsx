import { Col, Table, Tag, Typography } from 'antd';
import { green, red } from '@ant-design/colors';
import React, { Component } from 'react';

import './Transactions.css'
import { TransactionsContext } from './TransactionsProvider';

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
                {(tags)
                    ? tags.map(tag => {
                        let color = tagColors[tag];
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })
                    : []}
            </span>
        ),
    },
    {
        title: schema[4],
        dataIndex: schema[4].toLowerCase(),
        key: schema[4].toLowerCase(),
    },
];

class Transactions extends Component {
    render() {
        const { transactionSpan } = this.props;

        return (
            <Col className="transactions-list" {...transactionSpan}>
                <Typography.Title level={2}>
                    Transactions
                </Typography.Title>
                <TransactionsContext.Consumer>
                    {(context) => (
                        <Table
                            className="transactions"
                            columns={columns}
                            dataSource={context.transactions}
                            pagination={false}
                            rowKey={(record) => {
                                return record.id;
                            }}
                            size="middle"
                        />
                    )}
                </TransactionsContext.Consumer>
            </Col>
        );
    }
}

export default Transactions;