import axios from 'axios';
import React, { Component } from 'react';

class AccountsProvider extends Component {
  state = {
    accounts: [],
    summary: {
      wealth: 0.00,
      debt: 0.00,
      savings: 0.00,
    }
  };

  componentDidMount() {
    this.getAccounts();
  }

  // retrieves accounts across all items and calculates summary
  getAccounts = () => {
    this.props.setLoading(true);
    axios.get('/api/accounts')
      .then(res => {
        const data = res.data.accounts;
        const accounts = filterAccounts(data);
        const summary = calculateSummary(accounts);
        this.setState(
          { accounts: accounts, summary: summary },
          () => this.props.setLoading(false)
        );
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <AccountsContext.Provider value={{
        accounts: this.state.accounts,
        summary: this.state.summary,
        getAccounts: this.getAccounts
      }}>
        {this.props.children}
      </AccountsContext.Provider>
    )
  }
}

// calculates sum of debt, savings, and wealth from given accounts
function calculateSummary(accounts) {
  let debt = 0.00, savings = 0.00, wealth = 0.00;
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    const balance = acc.balances.current;
    if (acc.type === 'depository') {
      if (acc.subtype === 'checking')
        wealth += balance;
      else if (acc.subtype === 'savings')
        savings += balance;
    } else if (acc.type === 'credit')
      debt += balance;
  }
  return {
    debt: debt.toFixed(2),
    savings: savings.toFixed(2),
    wealth: wealth.toFixed(2),
  };
}

// returns accounts that have names
function filterAccounts(data) {
  let accounts = [];
  for (let i = 0; i < data.length; i++) {
    for (const [, value] of Object.entries(data[i])) {
      if (value.name)
        accounts.push(value);
    }
  }
  return accounts;
}

export const AccountsContext = React.createContext({});

export default AccountsProvider;