import { Card, Col, List, Row, Skeleton } from 'antd';
import React, { Component } from 'react';

import AddAccount from './AddAccount';
import './ListOfAccounts.css';

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
  render() {
    const credit = formatAccounts('credit', this.props.accounts);
    const depository = formatAccounts('depository', this.props.accounts);

    const header = (
      <Row>
        <Col span={18} align="left">
          <h2 className="ant-typography">All Accounts</h2>
        </Col>
        <Col span={6} align="right">
          <AddAccount onSuccess={this.props.onSuccess} />
        </Col>
      </Row>
    );

    return (
      <Card id="all-accounts" bordered={false} title={header}>
        {!this.props.loading
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
          : <Skeleton active paragraph={{ rows: 6 }} />
        }
      </Card>
    );
  }
}

export default ListOfAccounts;