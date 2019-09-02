import { Layout, Row } from 'antd';
import React from 'react';

import Breakdown from '../../components/charts/Breakdown';
import Expenses from '../../components/charts/Expenses';
import SummaryGroup from '../../components/summary/SummaryGroup';
import ListOfTransactions from '../../components/transactions/ListOfTransactions';
import { EditingProvider } from '../../components/stores/EditingProvider';
import { HomeProvider } from '../../components/stores/HomeProvider';
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
              <SummaryGroup />
            </Row>
            <Row type="flex" justify="center" gutter={gutter}>
              <Expenses span={{ xs: 24, lg: 12 }} />
              <Breakdown span={{ xs: 24, lg: 12 }} />
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