import { Layout } from 'antd';
import React, { Component } from 'react';

import "./Overview.css";

class Overview extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout style={{ marginLeft: 200 }}>
          <Layout.Content>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default Overview;