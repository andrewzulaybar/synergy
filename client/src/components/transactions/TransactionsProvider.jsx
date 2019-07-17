import axios from "axios";
import React, { Component } from 'react';

const defaultValue = {
  transactions: [],
  handleAdd: null,
};

export const TransactionsContext = React.createContext(defaultValue);

class TransactionsProvider extends Component {
  state = {
    transactions: [],
  };

  // helper for creating new transaction on server
  _createNewTransaction = (transaction, listOfTransactions) => {
    axios.post('/api/transactions', transaction)
      .then(res => {
        this.setState({
          transactions: [...listOfTransactions, res.data]
        });
      })
      .catch(error => {
        console.log(error);
      })
  };

  // helper for deleting given transactions
  _deleteTransactions = transactionIDs => {
    const data = { data: { transactionIDs: transactionIDs }};
    axios.delete('/api/transactions', data)
      .then(res => {
        this._removeDeletedTransactions(res.data.transactionIDs);
      })
      .catch( error => {
        console.log(error);
      });
  };

  // helper for retrieving transactions
  _getTransactions = () => {
    axios.get('/api/transactions')
      .then(res => {
        this.setState({
          transactions: res.data.transactions
        });
      })
      .catch(error => {
        console.log(error);
      })
  };

  // helper for removing given transactions from current state given IDs
  _removeDeletedTransactions = deletedTransactionIDs => {
    const remainingTransactions = this.state.transactions
      .filter(element =>
        !deletedTransactionIDs.includes(element._id)
      );
    this.setState({
      transactions: remainingTransactions
    });
  };

  // call back-end API to retrieve data
  componentDidMount() {
    this._getTransactions();
  };

  // handler for adding transaction
  handleAdd = (transaction) => {
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
  handleDelete = (transactionIDs) => {
    this._deleteTransactions(transactionIDs);
  };

  render() {
    return (
      <TransactionsContext.Provider value={{
        transactions: this.state.transactions,
        handleAdd: this.handleAdd,
        handleDelete: this.handleDelete,
      }}>
        {this.props.children}
      </TransactionsContext.Provider>
    );
  }
}

export default TransactionsProvider;