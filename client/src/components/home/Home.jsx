import { Layout, Row } from 'antd';
import React, { Component } from 'react';
import "antd/dist/antd.css";

import DoughnutChart from "./DoughnutChart";
import LineChart from "./LineChart";
import Summary from "./Summary";
import Transactions from "./Transactions";
import TransactionsProvider, { TransactionsContext } from "./TransactionsProvider";
import './Home.css';

class Home extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout id="home">
          <Layout.Content>
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
                      <Row gutter={16}>
                        <LineChart span={{
                          xs: 0,
                          sm: 24,
                          lg: 12,
                        }} />
                        <DoughnutChart span={{
                          xs: 0,
                          sm: 24,
                          lg: 12,
                        }} />
                      </Row>
                      <Row type="flex" justify="space-around">
                        <Transactions
                          handleAdd={context.handleAdd}
                          handleDelete={context.handleDelete}
                          transactions={context.state.transactions}
                          span={{ xs: 24 }}
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