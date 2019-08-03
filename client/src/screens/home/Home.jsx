import { Layout, Row } from 'antd';
import React, { Component } from 'react';
import "antd/dist/antd.css";

import Breakdown from "../../components/charts/Breakdown";
import Expenses from "../../components/charts/Expenses";
import Group from "../../components/summary/Group";
import Table from "../../components/transactions/Table";
import Provider, { TransactionsContext } from "../../components/transactions/Provider";
import './Home.css';

class Home extends Component {
  render() {
    const gutter = 16;

    return (
      <Layout style={{ minHeight: '100vh' }}>
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
                        <Expenses
                          span={{ xs: 0, sm: 24, lg: 12 }}
                          subject={context.subject}
                        />
                        <Breakdown
                          span={{ xs: 0, sm: 24, lg: 12 }}
                          subject={context.subject}
                        />
                      </Row>
                      <Row type="flex" justify="space-around">
                        <Table
                          handleDelete={context.handleDelete}
                          transactions={context.state.transactions}
                          span={{ xs: 24 }}
                        />
                      </Row>
                    </>
                  )}
                </TransactionsContext.Consumer>
              </Provider>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default Home;