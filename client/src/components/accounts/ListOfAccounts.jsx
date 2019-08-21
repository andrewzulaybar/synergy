import { Card, Col, List, Row, Skeleton } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';

import AddAccount from './AddAccount';

// generates format for accounts in allAccounts that match type
function formatAccounts(type, allAccounts) {
  const accounts = [];
  for (let i = 0; i < allAccounts.length; i++) {
    const account = allAccounts[i];
    if (account.type === type) {
      accounts.push(
        <Row type="flex" justify="space-around" align="middle">
          <Col span={18} align="left">
            <h1>{account.name}</h1>
            <small>{account.official_name}</small>
          </Col>
          <Col span={6} align="right">
            <h1>$ {account.balances.current.toFixed(2)}</h1>
          </Col>
        </Row>
      );
    }
  }
  return accounts;
}

class ListOfAccounts extends Component {
  state = {
    accounts: [],
    loading: true,
  };

  componentDidMount() {
    this.getAccounts();
  }

  // retrieves accounts across all items from API
  getAccounts = () => {
    this.setState({ loading: true });
    axios.get('/api/accounts/')
      .then(res => this.getAccountsWithNames(res.data.accounts))
      .catch(error => console.log(error));
  };

  // filters list of accounts and keeps only ones with names
  getAccountsWithNames = data => {
    const accounts = [];
    for (let i = 0; i < data.length; i++) {
      for (const [, value] of Object.entries(data[i])) {
        if (value.name)
          accounts.push(value);
      }
    }
    this.setState({ accounts: accounts, loading: false });
  };

  render() {
    const credit = formatAccounts('credit', this.state.accounts);
    const depository = formatAccounts('depository', this.state.accounts);

    const header = (
      <Row>
        <Col span={18} align="left">
          <h2 className="ant-typography">All Accounts</h2>
        </Col>
        <Col span={6} align="right">
          <AddAccount onSuccess={this.getAccounts} />
        </Col>
      </Row>
    );

    return (
      <Card id="accounts" bordered={false} title={header}>
        {!this.state.loading
          ? <Col span={24}>
              <Card bordered={false} id="credit" title={<h2>Credit</h2>}>
                <List
                  itemLayout="horizontal"
                  dataSource={credit}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta title={item} />
                    </List.Item>
                  )}
                />
              </Card>
              <Card bordered={false} id="depository" title={<h2>Depository</h2>}>
                <List
                  itemLayout="horizontal"
                  dataSource={depository}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta title={item} />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          : <Skeleton active paragraph={{ rows: 6 }} />}
      </Card>
    );
  }
}

export default ListOfAccounts;