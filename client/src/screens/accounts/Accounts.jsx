import React, { Component } from 'react'
import { Card, Layout } from "antd";

import './Accounts.css'

class Accounts extends Component {
  render() {
    const header = (
      <h2 className="ant-typography">
        List of Accounts
      </h2>
    );

    return (
      <Layout id="accounts">
        <Layout.Content className="App">
          <Card id="accounts" bordered={false} title={header} />
        </Layout.Content>
      </Layout>
    )
  }
}
export default Accounts;