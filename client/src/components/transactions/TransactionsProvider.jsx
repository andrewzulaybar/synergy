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

    // call back-end API to retrieve data
    componentDidMount() {
        axios.get('/api/transactions')
            .then(res => {
                this.setState({
                    transactions: res.data.transactions
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