import axios from 'axios';
import {Layout, Row} from 'antd';
import React, { Component } from 'react';
import "antd/dist/antd.css";

import './Home.css';
import Summary from "../Summary";

class Home extends Component {
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
                        </div>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

export default Home;