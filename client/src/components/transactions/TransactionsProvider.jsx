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

    // call back-end API to retrieve data
    componentDidMount() {
        this._getTransactions();
    };

    // handler for adding transaction
    handleAdd = (transaction) => {
        const newData = {
            id: this.state.transactions.length + 1,
            amount: transaction.amount,
            description: transaction.description,
            method: transaction.method,
            tags: transaction.tags,
            date: transaction.date
        };
        this._createNewTransaction(newData, this.state.transactions);
    };

    render() {
        return (
            <TransactionsContext.Provider value={{
                transactions: this.state.transactions,
                handleAdd: this.handleAdd
            }}>
                {this.props.children}
            </TransactionsContext.Provider>
        );
    }
}

export default TransactionsProvider;