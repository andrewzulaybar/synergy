import { Layout, Row } from 'antd';
import React, { Component } from 'react';

// import Breakdown from '../../components/charts/Breakdown';
// import Expenses from '../../components/charts/Expenses';
import ListOfTransactions from '../../components/transactions/ListOfTransactions';
// import Summary from '../../components/summary/Summary';
import { EditingProvider } from '../../components/stores/EditingProvider';
import { TransactionsProvider } from '../../components/stores/TransactionsProvider';
import '../root/Root.css';

class Home extends Component {
  __isMounted = true;

  updateHandlers = [];

  state = {
    loading: 1,
    isLoading: true,
  };

  componentWillUnmount() {
    this.__isMounted = false;
  }

  // decreases loading count by 1 then checks if all loading is complete
  finishedLoading = () => {
    if (this.__isMounted)
      this.setState(
        currState => currState.loading -= 1,
        () => {
          this.isDoneLoading()
        }
      );
  };

  // checks if all loading is complete
  isDoneLoading() {
    if (this.state.loading === 0 && this.__isMounted)
      this.setState({ isLoading: false });
  };

  // stores reference to update handler
  onUpdate = update => {
    this.updateHandlers.push(update);
  };

  // calls onUpdate functions
  update = () => {
    for (let i = 0; i < this.updateHandlers.length; i++) {
      this.updateHandlers[i]();
    }
  };

  render() {
    // const gutter = 16;
    // const { isLoading } = this.state;

    return (
      <Layout id="home">
        <Layout.Content className="App">
          <TransactionsProvider
            finishedLoading={this.finishedLoading}
          >
            {/*<Row type="flex" justify="center" gutter={gutter}>*/}
              {/*<Summary*/}
                {/*percent={context.weekExpensesPercent}*/}
                {/*title="Weekly Expenses"*/}
                {/*amount={context.weekExpenses}*/}
                {/*isLoading={isLoading}*/}
              {/*/>*/}
              {/*<Summary*/}
                {/*percent={context.monthExpensesPercent}*/}
                {/*title="Monthly Expenses"*/}
                {/*amount={context.monthExpenses}*/}
                {/*isLoading={isLoading}*/}
              {/*/>*/}
              {/*<Summary*/}
                {/*percent={context.monthIncomePercent}*/}
                {/*title="Monthly Income"*/}
                {/*amount={context.monthIncome}*/}
                {/*isLoading={isLoading}*/}
              {/*/>*/}
            {/*</Row>*/}
            {/*<Row type="flex" justify="center" gutter={gutter}>*/}
              {/*<Expenses*/}
                {/*span={{ xs: 24, lg: 12 }}*/}
                {/*finishedLoading={this.finishedLoading}*/}
                {/*isLoading={isLoading}*/}
                {/*onUpdate={this.onUpdate}*/}
              {/*/>*/}
              {/*<Breakdown*/}
                {/*span={{ xs: 24, lg: 12 }}*/}
                {/*finishedLoading={this.finishedLoading}*/}
                {/*isLoading={isLoading}*/}
                {/*onUpdate={this.onUpdate}*/}
              {/*/>*/}
            {/*</Row>*/}
            <Row type="flex" justify="space-around">
              <EditingProvider>
                <ListOfTransactions span={{ xs: 24 }} />
              </EditingProvider>
            </Row>
          </TransactionsProvider>
        </Layout.Content>
      </Layout>
    );
  }
}

export default Home;