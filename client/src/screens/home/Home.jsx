import { Layout, Row } from 'antd';
import React, { Component } from 'react';
import "antd/dist/antd.css";

import Breakdown from "../../components/charts/Breakdown";
import Expenses from "../../components/charts/Expenses";
import Group from "../../components/summary/Group";
import List from "../../components/transactions/List";
import Provider, { TransactionsContext } from "../../components/transactions/Provider";
import './Home.css';

class Home extends Component {
  render() {
    const gutter = 16;

    return (
      <Layout id="home">
        <Layout.Content className="App">
          <Provider>
            <TransactionsContext.Consumer>
              {context => (
                <>
                  <Row type="flex" justify="center" gutter={gutter}>
                    <Group subject={context.subject} />
                  </Row>
                  <Row type="flex" justify="center" gutter={gutter}>
                    <Expenses span={{ xs: 24, lg: 12 }} />
                    <Breakdown span={{ xs: 24, lg: 12 }} />
                  </Row>
                  <Row type="flex" justify="space-around">
                    <List span={{ xs: 24 }} subject={context.subject} />
                  </Row>
                </>
              )}
            </TransactionsContext.Consumer>
          </Provider>
        </Layout.Content>
      </Layout>
    );
  }
}

export default Home;