import axios from "axios";
import React, { Component } from 'react';

import { createDate, formatDate } from '../../../utils/Date';

const defaultValue = {
  state: {
    transactions: [],
    weeklyExpenses: 0,
    weeklyExpensesPercentChange: 0,
    monthlyExpenses: 0,
    monthlyExpensesPercentChange: 0,
    monthlyIncome: 0,
    monthlyIncomePercentChange: 0,
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
    monthlyIncome: 0,
    monthlyIncomePercentChange: 0,
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

  // retrieves period summary according to type (expenses or income)
  async _getPeriodSummary(start, end, type) {
    let total = 0;
    await axios.get('/api/transactions/summary?type=' + type + '&start=' + start + '&end=' + end)
      .then(res => total = Math.abs(res.data.summary.sum))
      .catch(error => console.log(error));
    return total;
  };

  // updates summary cards
  _updateSummary() {
    this._updateWeeklyExpenses();
    this._updateMonthlyExpenses();
    this._updateMonthlyIncome();
  }

  // helper for retrieving summary for current period and previous period
  _retrievePeriodSummary(lastPeriodStart, thisPeriodStart, thisPeriodEnd, type) {
    let summaryType = type.toLowerCase().includes('income') ? 'income' : 'expenses';
    this._getPeriodSummary(thisPeriodStart, thisPeriodEnd, summaryType)
      .then(thisPeriodTotal =>
        this._getPeriodSummary(lastPeriodStart, thisPeriodStart, summaryType)
          .then(lastPeriodTotal =>
            this._updateState(thisPeriodTotal, lastPeriodTotal, type)
          )
          .catch(error => console.log(error))
      )
      .catch(error => console.log(error))
  }

  // helper for updating state
  _updateState = (currentPeriodTotal, previousPeriodTotal, type) => {
    let typePercentChange = type + 'PercentChange';
    this.setState({
      [type]: currentPeriodTotal.toFixed(2),
      [typePercentChange]:
        Math.round((previousPeriodTotal !== 0)
          ? (currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal * 100
          : currentPeriodTotal
        )
    });
  };

  // updates weekly expenses and percent change
  _updateWeeklyExpenses() {
    let end = createDate();
    let thisWeekStart = createDate(7);
    let lastWeekStart = createDate(14);

    this._retrievePeriodSummary(lastWeekStart, thisWeekStart, end, 'weeklyExpenses');
  }

  // updates monthly expenses and percent change
  _updateMonthlyExpenses() {
    let today = new Date();

    let end = formatDate(today);
    let thisMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));

    this._retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'monthlyExpenses');
  }

  // updates monthly income and percent change
  _updateMonthlyIncome() {
    let today = new Date();

    let end = formatDate(today);
    let thisMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));

    this._retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'monthlyIncome');
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