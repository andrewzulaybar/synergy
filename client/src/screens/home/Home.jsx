import { Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import Breakdown from '../../components/charts/Breakdown';
import Expenses from '../../components/charts/Expenses';
import SummaryGroup from '../../components/summary/SummaryGroup';
import ListOfTransactions from '../../components/transactions/ListOfTransactions';
import { EditingProvider } from '../../components/stores/EditingProvider';
import { SummaryProvider } from '../../components/stores/SummaryProvider';
import { TransactionsProvider } from '../../components/stores/TransactionsProvider';
import '../root/Root.css';

const Home = () => {
  const [loading, updateLoading] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading === 0)
      setIsLoading(false);
  }, [loading]);

  // decreases loading count by 1 then checks if all loading is complete
  function finishedLoading() {
    updateLoading(loading - 1);
  }

  // const updateHandlers = [];
  //
  // // stores reference to update handler
  // onUpdate = update => {
  //   this.updateHandlers.push(update);
  // };
  //
  // // calls onUpdate functions
  // update = () => {
  //   for (let i = 0; i < this.updateHandlers.length; i++) {
  //     this.updateHandlers[i]();
  //   }
  // };


  const gutter = 16;

  return (
    <Layout id="home">
      <Layout.Content className="App">
        <TransactionsProvider finishedLoading={finishedLoading}>
          <Row type="flex" justify="center" gutter={gutter}>
            <SummaryProvider finishedLoading={finishedLoading}>
              <SummaryGroup isLoading={isLoading} />
            </SummaryProvider>
          </Row>
          <Row type="flex" justify="center" gutter={gutter}>
            <Expenses
              span={{ xs: 24, lg: 12 }}
              finishedLoading={finishedLoading}
              isLoading={isLoading}
            />
            <Breakdown
              span={{ xs: 24, lg: 12 }}
              finishedLoading={finishedLoading}
              isLoading={isLoading}
            />
          </Row>
          <Row type="flex" justify="space-around">
            <EditingProvider>
              <ListOfTransactions span={{ xs: 24 }} isLoading={isLoading}/>
            </EditingProvider>
          </Row>
        </TransactionsProvider>
      </Layout.Content>
    </Layout>
  );
};


export default Home;