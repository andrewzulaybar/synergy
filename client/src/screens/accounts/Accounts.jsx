import { Layout, Row } from 'antd';
import React, { Component } from 'react'

import AccountsProvider, { AccountsContext } from '../../components/accounts/AccountsProvider';
import ListOfAccounts from '../../components/accounts/ListOfAccounts';
import Summary from '../../components/summary/Summary';
import '../root/Root.css';

class Accounts extends Component {
  state = { loading: true };

  setLoading = loading => this.setState({ loading });

  render() {
    return (
      <Layout id="accounts">
        <Layout.Content className="accounts">
          <AccountsProvider setLoading={this.setLoading}>
            <AccountsContext.Consumer>
              {context => (
                <>
                  <Row gutter={16}>
                  <Summary
                    amount={context.summary.wealth}
                    loading={this.state.loading}
                    title="Total Wealth"
                  />
                  <Summary
                    amount={context.summary.debt}
                    loading={this.state.loading}
                    title="Total Debt"
                  />
                  <Summary
                    amount={context.summary.savings}
                    loading={this.state.loading}
                    title="Total Savings"
                  />
                  </Row>
                  <Row>
                    <ListOfAccounts
                      accounts={context.accounts}
                      loading={this.state.loading}
                    />
                  </Row>
                </>
              )}
            </AccountsContext.Consumer>
          </AccountsProvider>
        </Layout.Content>
      </Layout>
    )
  }
}

export default Accounts;