import axios from 'axios';
import React, { Component } from 'react';

import { calculateSummary, filterAccounts } from "../../utils/accounts/accounts";

class AccountsProvider extends Component {
  __isMounted = true;

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

  componentWillUnmount() {
    this.__isMounted = false;
  }

  // retrieves accounts across all items and calculates summary
  getAccounts = () => {
    this.props.setIsLoading(true);
    axios.get('/api/accounts')
      .then(res => {
        const data = res.data.accounts;
        const accounts = filterAccounts(data);
        const summary = calculateSummary(accounts);
        if (this.__isMounted) {
          this.setState(
            { accounts: accounts, summary: summary },
            () => this.props.setIsLoading(false)
          );
        }
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

export const AccountsContext = React.createContext({});

export default AccountsProvider;