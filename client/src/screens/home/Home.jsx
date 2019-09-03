import { Layout, Row } from 'antd';
import React from 'react';

import Breakdown from '../../components/charts/Breakdown';
import Expenses from '../../components/charts/Expenses';
import Summary from '../../components/summary/Summary';
import ListOfTransactions from '../../components/transactions/ListOfTransactions';
import { EditingProvider } from '../../components/stores/EditingProvider';
import { HomeProvider } from '../../components/stores/HomeProvider';
import { SummaryContext, SummaryProvider } from '../../components/stores/SummaryProvider';
import { TransactionsProvider } from '../../components/stores/TransactionsProvider';
import '../root/Root.css';

const Home = () => {
  const gutter = 16;
  return (
    <Layout id="home">
      <Layout.Content className="App">
        <HomeProvider>
          <TransactionsProvider>
            <Row type="flex" justify="center" gutter={gutter}>
              <SummaryProvider>
                <SummaryContext.Consumer>
                  {({ state }) => (
                    <>
                      <Summary
                        title="Weekly Expenses"
                        amount={state.summary.weekExpenses}
                        percent={state.summary.weekExpensesPercent}
                        isLoading={state.isLoading}
                      />
                      <Summary
                        title="Monthly Expenses"
                        amount={state.summary.monthExpenses}
                        percent={state.summary.monthExpensesPercent}
                        isLoading={state.isLoading}
                      />
                      <Summary
                        title="Monthly Income"
                        amount={state.summary.monthIncome}
                        percent={state.summary.monthIncomePercent}
                        isLoading={state.isLoading}
                      />
                    </>
                  )}
                </SummaryContext.Consumer>
              </SummaryProvider>
            </Row>
            <Row type="flex" justify="center" gutter={gutter}>
              <Expenses/>
              <Breakdown/>
            </Row>
            <Row type="flex" justify="space-around">
              <EditingProvider>
                <ListOfTransactions span={{ xs: 24 }} />
              </EditingProvider>
            </Row>
          </TransactionsProvider>
        </HomeProvider>
      </Layout.Content>
    </Layout>
  );
};

export default Home;