import axios from 'axios';
import { Layout } from 'antd';
import React, { Component } from 'react';
import "antd/dist/antd.css";

import './Home.css';

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
                    <Layout.Content style={{ margin: '24px 24px 24px', overflow: 'initial' }}>
                        <div className="App">
                            <header className="App-header">
                                {this.state.isConnected
                                    ? "Express back-end is connected!"
                                    : "Express back-end is not connected"}
                            </header>
                        </div>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

export default Home;