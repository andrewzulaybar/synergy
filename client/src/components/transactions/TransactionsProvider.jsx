import axios from 'axios';
import React, { Component } from 'react';

import { createDate, formatDate } from '../../utils/misc/date';

class TransactionsProvider extends Component {
  __isMounted = true;

  state = {
    transactions: [],
    weeklyExpenses: 0,
    weeklyExpensesPercentChange: 0,
    monthlyExpenses: 0,
    monthlyExpensesPercentChange: 0,
    monthlyIncome: 0,
    monthlyIncomePercentChange: 0,
  };

  componentDidMount() {
    this.getTransactions();
    this.props.finishedLoading();

    this.updateWeeklyExpenses();
    this.props.finishedLoading();
    this.updateMonthlyExpenses();
    this.props.finishedLoading();
    this.updateMonthlyIncome();
    this.props.finishedLoading();

    this.props.onUpdate(this.onUpdate);
  };

  componentWillUnmount() {
    this.__isMounted = false;
  }

  // refreshes summary cards on update
  onUpdate = () => {
    this.updateWeeklyExpenses();
    this.updateMonthlyExpenses();
    this.updateMonthlyIncome();
  };

  // handler for adding new transaction
  handleAdd = transaction => {
    const newData = {
      amount: transaction.amount,
      description: transaction.description,
      method: transaction.method,
      tags: transaction.tags,
      date: transaction.date
    };
    this.createNewTransaction(newData);
  };

  // handler for updating transaction
  handleUpdate = (transaction, id) => {
    let transactions = this.state.transactions;
    const index = transactions.findIndex(item => id === item._id);
    transactions.splice(index, 1);

    axios.put('api/transactions/' + id, transaction)
      .then(res => {
        res.data.transaction.date = res.data.transaction.date.split('T')[0];
        const newTransactions = this.insertNewTransaction({...res.data.transaction}, true);
        if (this.__isMounted) {
          this.setState(
            {transactions: newTransactions},
            () => this.props.update()
          );
        }
      })
      .catch(error => console.log(error));
  };

  // handler for deleting transactions
  handleDelete = transactionIDs => {
    const data = { data: { transactionIDs: transactionIDs }};
    axios.delete('/api/transactions', data)
      .then(res =>
        this.removeDeletedTransactions(res.data.transactionIDs)
      )
      .catch(error => console.log(error));
  };

  // retrieves list of transactions
  getTransactions() {
    axios.get('/api/transactions')
      .then(res => {
        if (this.__isMounted)
          this.setState({ transactions: res.data.transactions });
      })
      .catch(error => console.log(error))
  };

  // helper for creating new transaction on server
  createNewTransaction(transaction) {
    axios.post('/api/transactions', transaction)
      .then(res => {
        if (this.__isMounted) {
          this.setState(
            { transactions: this.insertNewTransaction(res.data.transaction) },
            () => this.props.update()
          )
        }
      })
      .catch(error => console.log(error));
  };

  // helper for inserting new transaction into current list of transactions
  insertNewTransaction(transaction) {
    const list = this.state.transactions;
    let i = 0;
    while (i < list.length && list[i].date > transaction.date) i++;
    list.splice(i, 0, transaction);
    return list;
  }

  // helper for removing given transactions from current state given IDs
  removeDeletedTransactions(deletedTransactionIDs) {
    const remainingTransactions = this.state.transactions
      .filter(element => !deletedTransactionIDs.includes(element._id));
    if (this.__isMounted) {
      this.setState(
        { transactions: remainingTransactions },
        () => this.props.update()
      );
    }
  };

  // helper for updating state
  updateState = (currentPeriodTotal, previousPeriodTotal, type) => {
    let typePercentChange = type + 'PercentChange';
    if (this.__isMounted) {
      this.setState({
        [type]: currentPeriodTotal.toFixed(2),
        [typePercentChange]:
          Math.round((previousPeriodTotal !== 0)
            ? (currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal * 100
            : currentPeriodTotal
          )
        });
    }
  };

  // updates weekly expenses and percent change
  updateWeeklyExpenses() {
    let end = createDate(-1);
    let thisWeekStart = createDate(6);
    let lastWeekStart = createDate(13);

    this.retrievePeriodSummary(lastWeekStart, thisWeekStart, end, 'weeklyExpenses');
  }

  // updates monthly expenses and percent change
  updateMonthlyExpenses() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let end = formatDate(tomorrow);
    let thisMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth() - 1, 1));

    this.retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'monthlyExpenses');
  }

  // updates monthly income and percent change
  updateMonthlyIncome() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let end = formatDate(tomorrow);
    let thisMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(tomorrow.getFullYear(), tomorrow.getMonth() - 1, 1));

    this.retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'monthlyIncome');
  }

  // helper for retrieving summary for current period and previous period
  retrievePeriodSummary(lastPeriodStart, thisPeriodStart, thisPeriodEnd, type) {
    let summaryType = type.toLowerCase().includes('income') ? 'income' : 'expenses';
    this.getPeriodSummary(thisPeriodStart, thisPeriodEnd, summaryType)
      .then(thisPeriodTotal =>
        this.getPeriodSummary(lastPeriodStart, thisPeriodStart, summaryType)
          .then(lastPeriodTotal =>
            this.updateState(thisPeriodTotal, lastPeriodTotal, type)
          )
          .catch(error => console.log(error))
      )
      .catch(error => console.log(error))
  }

  // retrieves period summary according to type (expenses or income)
  async getPeriodSummary(start, end, type) {
    let total = 0;
    await axios.get('api/transactions/summary', {
      params: {
        type: type,
        start: start,
        end: end,
      }
    })
      .then(res => total = Math.abs(res.data.summary.sum))
      .catch(error => console.log(error));
    return total;
  }

  render() {
    return (
      <TransactionsContext.Provider value={{
        transactions: this.state.transactions,
        weeklyExpenses: this.state.weeklyExpenses,
        weeklyExpensesPercentChange: this.state.weeklyExpensesPercentChange,
        monthlyExpenses: this.state.monthlyExpenses,
        monthlyExpensesPercentChange: this.state.monthlyExpensesPercentChange,
        monthlyIncome: this.state.monthlyIncome,
        monthlyIncomePercentChange: this.state.monthlyIncomePercentChange,
        handleAdd: this.handleAdd,
        handleUpdate: this.handleUpdate,
        handleDelete: this.handleDelete,
      }}>
        {this.props.children}
      </TransactionsContext.Provider>
    );
  }
}

export const TransactionsContext = React.createContext({});

export default TransactionsProvider;