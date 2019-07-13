import { Layout, Row } from 'antd';
import axios from "axios";
import React, { Component } from 'react';
import "antd/dist/antd.css";

import './Home.css';
import AddTransaction from '../transactions/AddTransaction';
import Summary from "../summary/Summary";
import Transactions from "../transactions/Transactions";

class Home extends Component {
    state = {
        isConnected: false,
        transactions: [
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
        ]
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

    // handler for adding transaction
    handleAdd = (transaction) => {
        const count = this.state.transactions.length;
        const newData = {
            id: count + 1,
            amount: transaction.amount,
            description: transaction.description,
            method: transaction.method,
            tags: transaction.tags,
            date: transaction.date
        };

        this.setState({
            transactions: [...this.state.transactions, newData]
        });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Layout style={{ marginLeft: 200 }}>
                    <Layout.Content style={{ padding: 16, overflow: 'initial' }}>
                        <div className="App">
                            <Row type="flex" justify="center" gutter={16}>
                                <Summary
                                    percent={104}
                                    title="Weekly Expenses"
                                    amount={250.39}
                                />
                                <Summary
                                    percent={-16}
                                    title="Monthly Expenses"
                                    amount={1503.72}
                                />
                                <Summary
                                    percent={0}
                                    title="Monthly Income"
                                    amount={840.26}
                                />
                                <Summary
                                    percent={73}
                                    title="Monthly Savings"
                                    amount={150.00}
                                />
                            </Row>
                            <Row type="flex" justify="space-around">
                                <Transactions
                                    transactions={this.state.transactions}
                                    transactionSpan={{ xs: 24, sm: 24, md: 24, lg: 16 }}
                                />
                                <AddTransaction
                                    addTransactionSpan={{ xs: 24, sm: 18, md: 12, lg: 6 }}
                                    clickHandler={this.handleAdd}
                                />
                            </Row>
                        </div>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

export default Home;