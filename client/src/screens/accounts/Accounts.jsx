import React, { Component } from 'react'
import { Layout } from "antd";

import './Accounts.css'
import ListOfAccounts from "../../components/accounts/ListOfAccounts";

class Accounts extends Component {
  render() {
    return (
      <Layout id="accounts">
        <Layout.Content className="accounts">
          <ListOfAccounts />
        </Layout.Content>
      </Layout>
    )
  }
}
export default Accounts;