import React, { Component } from 'react';

import { updateWeeklyExpenses, updateMonthlyExpenses, updateMonthlyIncome } from '../../utils/summary/summary';
import {
  getTransactions,
  createNewTransaction,
  deleteTransactions,
  updateTransaction
} from '../../utils/transactions/transactions';

class TransactionsProvider extends Component {
  __isMounted = true;

  state = {
    transactions: [],
    weekExpenses: 0,
    weekExpensesPercent: 0,
    monthExpenses: 0,
    monthExpensesPercent: 0,
    monthIncome: 0,
    monthIncomePercent: 0,
  };

  componentDidMount() {
    const { finishedLoading } = this.props;

    getTransactions()
      .then(list => this.updateStateTransactions(list, finishedLoading))
      .catch(error => console.log(error));

    updateWeeklyExpenses()
      .then(summary => this.updateStateSummary(summary, 'weekExpenses', finishedLoading))
      .catch(error => console.log(error));
    updateMonthlyExpenses()
      .then(summary => this.updateStateSummary(summary, 'monthExpenses', finishedLoading))
      .catch(error => console.log(error));
    updateMonthlyIncome()
      .then(summary => this.updateStateSummary(summary, 'monthIncome', finishedLoading))
      .catch(error => console.log(error));

    this.props.onUpdate(this.onUpdate);
  };

  componentWillUnmount() {
    this.__isMounted = false;
  }

  // refreshes summary cards on update
  onUpdate = () => {
    updateWeeklyExpenses()
      .then(summary => this.updateStateSummary(summary, 'weekExpenses'))
      .catch(error => console.log(error));
    updateMonthlyExpenses()
      .then(summary => this.updateStateSummary(summary, 'monthExpenses'))
      .catch(error => console.log(error));
    updateMonthlyIncome()
      .then(summary => this.updateStateSummary(summary, 'monthIncome'))
      .catch(error => console.log(error));
  };

  // handler for adding new transaction
  handleAdd = transaction => {
    createNewTransaction(transaction, this.state.transactions)
      .then(list => this.updateStateTransactions(list, this.props.update))
      .catch(error => console.log(error));
  };

  // handler for updating transaction
  handleUpdate = (transaction, id) => {
    updateTransaction(transaction, id, this.state.transactions)
      .then(list => this.updateStateTransactions(list, this.props.update))
      .catch(error => console.log(error));
  };

  // handler for deleting transactions
  handleDelete = transactionIDs => {
    deleteTransactions(transactionIDs, this.state.transactions)
      .then(list => this.updateStateTransactions(list, this.props.update))
      .catch(error => console.log(error));
  };

  // helper for updating state transactions
  updateStateTransactions(list, callback) {
    if (this.__isMounted) {
      this.setState(
        currState => {
          currState.transactions = list;
          return currState;
        },
        () => callback()
      );
    }
  }

  // helper for updating state summary
  updateStateSummary(summary, type, callback = () => {}) {
    const current = summary.current;
    const previous = summary.previous;
    const typePercent = type + 'Percent';
    if (this.__isMounted) {
      this.setState(
        currState => {
          currState[type] = current.toFixed(2);
          currState[typePercent] =
            Math.round((previous !== 0) ? (current - previous) / previous * 100 : current);
          return currState;
        },
        () => callback()
      );
    }
  }

  render() {
    return (
      <TransactionsContext.Provider value={{
        transactions: this.state.transactions,
        weekExpenses: this.state.weekExpenses,
        weekExpensesPercent: this.state.weekExpensesPercent,
        monthExpenses: this.state.monthExpenses,
        monthExpensesPercent: this.state.monthExpensesPercent,
        monthIncome: this.state.monthIncome,
        monthIncomePercent: this.state.monthIncomePercent,
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