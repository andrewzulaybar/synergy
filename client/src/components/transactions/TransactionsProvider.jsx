import axios from "axios";
import React, { Component } from 'react';

const defaultValue = {
    transactions: [],
    handleAdd: null,
};

export const TransactionsContext = React.createContext(defaultValue);

class TransactionsProvider extends Component {
    state = {
        isConnected: false,
        transactions: [
            {
                id: 1,
                amount: '-20',
                description: 'H&M',
                method: 'Cash',
                tags: ['clothes'],
                date: 'Jan 20, 2019'
            },
            {
                id: 2,
                amount: '200',
                description: 'Work',
                method: 'Debit',
                tags: ['income'],
                date: 'Mar 29, 2019'
            },
            {
                id: 3,
                amount: '-50',
                description: 'Food',
                method: 'Mastercard',
                tags: ['restaurants'],
                date: 'Apr 20, 2019'
            },
            {
                id: 4,
                amount: '-8',
                description: 'Origins',
                method: 'Cash',
                tags: ['skincare', 'travel'],
                date: 'Dec 17, 2018'
            },
        ]
    };

    // call back-end API to retrieve data
    componentDidMount() {
        axios.get('/api')
            .then(res => {
                this.setState({
                    isConnected: res.data.isConnected,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    // handler for adding transaction
    handleAdd = (transaction) => {
        const count = this.state.transactions.length;
        const newData = {
            id: count + 1,
            amount: transaction.amount,
            description: transaction.description,
            method: transaction.method,
            tags: transaction.tags,
            date: transaction.date
        };

        this.setState({
            transactions: [...this.state.transactions, newData]
        });
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