import { Layout, Row } from 'antd';
import React, { Component } from 'react'

import AccountsProvider, { AccountsContext } from '../../components/accounts/AccountsProvider';
import ListOfAccounts from '../../components/accounts/ListOfAccounts';
import Summary from '../../components/summary/Summary';
import '../root/Root.css';

class Accounts extends Component {
  state = { isLoading: true };

  setIsLoading = isLoading => this.setState({ isLoading });

  render() {
    const { isLoading } = this.state;

    return (
      <Layout id="accounts">
        <Layout.Content className="accounts">
          <AccountsProvider setIsLoading={this.setIsLoading}>
            <AccountsContext.Consumer>
              {context => (
                <>
                  <Row gutter={16}>
                  <Summary
                    amount={context.summary.wealth}
                    title="Total Wealth"
                    isLoading={isLoading}
                  />
                  <Summary
                    amount={context.summary.debt}
                    title="Total Debt"
                    isLoading={isLoading}
                  />
                  <Summary
                    amount={context.summary.savings}
                    title="Total Savings"
                    isLoading={isLoading}
                  />
                  </Row>
                  <Row>
                    <ListOfAccounts
                      accounts={context.accounts}
                      isLoading={isLoading}
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