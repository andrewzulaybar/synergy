import axios from "axios";
import React, { Component } from 'react';

import { createDate } from '../../utils/Date';

const defaultValue = {
  transactions: [],
  handleAdd: null,
  handleDelete: null,
};

export const TransactionsContext = React.createContext(defaultValue);

class TransactionsProvider extends Component {
  state = {
    transactions: [],
    weeklyExpenses: 0,
    weeklyExpensesPercentChange: 0,
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
    console.log(newData);
    console.log(this.state);
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
  async _getWeeklyExpenses(start, end) {
    let weeklyExpenses = 0;
    await axios.get('/api/transactions/summary?start=' + start + '&end=' + end)
      .then(res => {
        if (res.data.summary.sum < 0)
          weeklyExpenses = -res.data.summary.sum;
      })
      .catch(error => console.log(error));
    return weeklyExpenses;
  };

  // updates summary cards
  _updateSummary() {
    this._updateWeeklyExpenses();
  }

  // updates weekly expenses and percent change
  _updateWeeklyExpenses() {
    let end = createDate();
    let start = createDate(7);
    let lastWeekEnd = createDate(8);
    let lastWeekStart = createDate(14);

    this._getWeeklyExpenses(start, end)
      .then(thisWeekExpenses =>
        this._getWeeklyExpenses(lastWeekStart, lastWeekEnd)
          .then(lastWeekExpenses =>
            this._updateStateWeeklyExpenses(thisWeekExpenses, lastWeekExpenses)
          )
          .catch(error => console.log(error))
      )
      .catch(error => console.log(error));
  }

  // helper for updating state weekly expenses and percent change
  _updateStateWeeklyExpenses(thisWeekExpenses, lastWeekExpenses) {
    this.setState({
      weeklyExpenses: thisWeekExpenses.toFixed(2),
      weeklyExpensesPercentChange:
        Math.round((lastWeekExpenses !== 0)
          ? (thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses * 100
          : thisWeekExpenses
        )
    });
  }

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