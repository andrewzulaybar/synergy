import axios from "axios";
import React, { Component } from 'react';

import { createDate, formatDate } from '../../utils/Date';

const defaultValue = {
  state: {
    transactions: [],
    weeklyExpenses: 0,
    weeklyExpensesPercentChange: 0,
    monthlyExpenses: 0,
    monthlyExpensesPercentChange: 0,
  },
  handleAdd: null,
  handleDelete: null,
};

export const TransactionsContext = React.createContext(defaultValue);

class TransactionsProvider extends Component {
  state = {
    transactions: [],
    weeklyExpenses: 0,
    weeklyExpensesPercentChange: 0,
    monthlyExpenses: 0,
    monthlyExpensesPercentChange: 0,
  };

  componentDidMount() {
    this._getTransactions();
    this._updateSummary();
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
    this._createNewTransaction(newData, this.state.transactions);
  };

  // handler for deleting transactions
  handleDelete = transactionIDs => {
    this._deleteTransactions(transactionIDs);
  };

  // retrieves list of transactions
  _getTransactions() {
    axios.get('/api/transactions')
      .then(res =>
        this.setState({ transactions: res.data.transactions })
      )
      .catch(error => console.log(error))
  };

  // retrieves sum of weekly expenses
  async _getPeriodExpenses(start, end) {
    let periodExpenses = 0;
    await axios.get('/api/transactions/summary?start=' + start + '&end=' + end)
      .then(res => {
        if (res.data.summary.sum < 0)
          periodExpenses = -res.data.summary.sum;
      })
      .catch(error => console.log(error));
    return periodExpenses;
  };

  // updates summary cards
  _updateSummary() {
    this._updateWeeklyExpenses();
    this._updateMonthlyExpenses();
  }

  // helper for retrieving expenses for current period and previous period
  _retrievePeriodExpenses(lastPeriodStart, thisPeriodStart, thisPeriodEnd, update) {
    this._getPeriodExpenses(thisPeriodStart, thisPeriodEnd)
      .then(thisPeriodExpenses =>
        this._getPeriodExpenses(lastPeriodStart, thisPeriodStart)
          .then(lastPeriodExpenses =>
            update(thisPeriodExpenses, lastPeriodExpenses)
          )
          .catch(error => console.log(error))
      )
      .catch(error => console.log(error))
  }

  // updates weekly expenses and percent change
  _updateWeeklyExpenses() {
    let end = createDate();
    let thisWeekStart = createDate(7);
    let lastWeekStart = createDate(14);

    this._retrievePeriodExpenses(lastWeekStart, thisWeekStart, end, this._updateStateWeeklyExpenses);
  }

  // helper for updating state weekly expenses and percent change
  _updateStateWeeklyExpenses = (thisWeekExpenses, lastWeekExpenses) => {
    this.setState({
      weeklyExpenses: thisWeekExpenses.toFixed(2),
      weeklyExpensesPercentChange:
        Math.round((lastWeekExpenses !== 0)
          ? (thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses * 100
          : thisWeekExpenses
        )
    });
  };

  // updates monthly expenses and percent change
  _updateMonthlyExpenses() {
    let today = new Date();

    let end = formatDate(today);
    let thisMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));

    this._retrievePeriodExpenses(lastMonthStart, thisMonthStart, end, this._updateStateMonthlyExpenses);
  }

  // helper for updating state monthly expenses and percent change
  _updateStateMonthlyExpenses = (thisMonthExpenses, lastMonthExpenses) => {
    this.setState({
      monthlyExpenses: thisMonthExpenses.toFixed(2),
      monthlyExpensesPercentChange:
        Math.round((lastMonthExpenses !== 0)
          ? (thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100
          : thisMonthExpenses
        )
    });
  };

  // helper for creating new transaction on server
  _createNewTransaction(transaction, listOfTransactions) {
    axios.post('/api/transactions', transaction)
      .then(res =>
        this.setState(
          { transactions: [...listOfTransactions, res.data] },
          () => this._updateSummary()
        )
      )
      .catch(error => console.log(error));
  };

  // helper for deleting given transactions
  _deleteTransactions(transactionIDs) {
    const data = { data: { transactionIDs: transactionIDs }};
    axios.delete('/api/transactions', data)
      .then(res =>
        this._removeDeletedTransactions(res.data.transactionIDs)
      )
      .catch(error => console.log(error));
  };

  // helper for removing given transactions from current state given IDs
  _removeDeletedTransactions(deletedTransactionIDs) {
    const remainingTransactions = this.state.transactions
      .filter(element =>
        !deletedTransactionIDs.includes(element._id)
      );
    this.setState(
      { transactions: remainingTransactions },
      () => this._updateSummary()
    );
  };

  render() {
    return (
      <TransactionsContext.Provider value={{
        state: this.state,
        handleAdd: this.handleAdd,
        handleDelete: this.handleDelete,
      }}>
        {this.props.children}
      </TransactionsContext.Provider>
    );
  }
}

export default TransactionsProvider;