import axios from 'axios';
import React from 'react';

import Subject from '../misc/Subject';

const defaultValue = {
  state: {
    transactions: [],
  },
  handleAdd: null,
  handleDelete: null,
};

export const TransactionsContext = React.createContext(defaultValue);

class Provider extends Subject {
  state = {
    transactions: [],
  };

  componentDidMount() {
    this.getTransactions();
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
        this.setState({ transactions: newTransactions });
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
        this.setState({transactions: res.data.transactions});
        this.notifyAllObservers();
      })
      .catch(error => console.log(error))
  };

  // helper for creating new transaction on server
  createNewTransaction(transaction) {
    axios.post('/api/transactions', transaction)
      .then(res =>
        this.setState(
          {transactions: this.insertNewTransaction(res.data.transaction)},
          () => this.notifyAllObservers()
        )
      )
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
    this.setState(
      { transactions: remainingTransactions },
      () => this.notifyAllObservers()
    );
  };

  render() {
    return (
      <TransactionsContext.Provider value={{
        state: this.state,
        handleAdd: this.handleAdd,
        handleUpdate: this.handleUpdate,
        handleDelete: this.handleDelete,
        subject: this,
      }}>
        {this.props.children}
      </TransactionsContext.Provider>
    );
  }
}

export default Provider;