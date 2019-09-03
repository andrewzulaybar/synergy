import { Layout, Row } from 'antd';
import React from 'react'

import ListOfAccounts from '../../components/accounts/ListOfAccounts';
import Summary from '../../components/summary/Summary';
import { AccountsContext, AccountsProvider } from '../../components/stores/AccountsProvider';
import '../root/Root.css';

const Accounts = () => {
  return (
    <Layout id="accounts">
      <Layout.Content className="accounts">
        <AccountsProvider>
          <AccountsContext.Consumer>
            {({ state }) => (
              <>
                <Row gutter={16}>
                  <Summary
                    amount={state.summary.wealth}
                    title="Total Wealth"
                    isLoading={state.isLoading}
                  />
                  <Summary
                    amount={state.summary.debt}
                    title="Total Debt"
                    isLoading={state.isLoading}
                  />
                  <Summary
                    amount={state.summary.savings}
                    title="Total Savings"
                    isLoading={state.isLoading}
                  />
                </Row>
                <Row>
                  <ListOfAccounts
                    accounts={state.accounts}
                    isLoading={state.isLoading}
                  />
                </Row>
              </>
            )}
          </AccountsContext.Consumer>
        </AccountsProvider>
      </Layout.Content>
    </Layout>
  )
};

export default Accounts;