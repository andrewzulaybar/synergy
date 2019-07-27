import { Layout, Row } from 'antd';
import React, { Component } from 'react';
import "antd/dist/antd.css";

import AddTransaction from './transactions/AddTransaction';
import Summary from "./summary/Summary";
import Transactions from "./transactions/Transactions";
import TransactionsProvider from "./transactions/TransactionsProvider";
import './Home.css';
import { TransactionsContext } from "./transactions/TransactionsProvider";

class Home extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout style={{ marginLeft: 200 }}>
          <Layout.Content style={{ padding: 16, overflow: 'initial' }}>
            <div className="App">
              <TransactionsProvider>
                <TransactionsContext.Consumer>
                  {(context) => (
                    <>
                      <Row type="flex" justify="center" gutter={16}>
                        <Summary
                          percent={context.state.weeklyExpensesPercentChange}
                          title="Weekly Expenses"
                          amount={context.state.weeklyExpenses}
                        />
                        <Summary
                          percent={context.state.monthlyExpensesPercentChange}
                          title="Monthly Expenses"
                          amount={context.state.monthlyExpenses}
                        />
                        <Summary
                          percent={context.state.monthlyIncomePercentChange}
                          title="Monthly Income"
                          amount={context.state.monthlyIncome}
                        />
                        <Summary
                          percent={73}
                          title="Monthly Savings"
                          amount={150.00}
                        />
                      </Row>
                      <Row type="flex" justify="space-around">
                        <Transactions
                          handleDelete={context.handleDelete}
                          transactions={context.state.transactions}
                          transactionSpan={{
                            xs: 24,
                            sm: 24,
                            md: 24,
                            lg: 16
                          }}
                        />
                        <AddTransaction
                          addTransactionSpan={{
                            xs: 24,
                            sm: 18,
                            md: 12,
                            lg: 6
                          }}
                          handleAdd={context.handleAdd}
                        />
                      </Row>
                    </>
                  )}
                </TransactionsContext.Consumer>
              </TransactionsProvider>
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default Home;