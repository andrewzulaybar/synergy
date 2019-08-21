import React, { Component } from 'react'
import { Layout } from 'antd';

import ListOfAccounts from '../../components/accounts/ListOfAccounts';
import '../root/Root.css';

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