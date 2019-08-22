import axios from 'axios';
import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';

class AddAccount extends Component {
  handleOnSuccess = token => {
    const body = { publicToken: token };
    axios.post('/api/accounts/', body)
      .then(() => this.props.onSuccess())
      .catch(error => console.log(error));
  };

  render() {
    return (
      <PlaidLink
        className="ant-btn"
        clientName="Synergy"
        countryCodes={['US', 'CA']}
        env="development"
        product={["transactions"]}
        publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
        onSuccess={this.handleOnSuccess}
        style={{}}
      >
        Add Account
      </PlaidLink>
    )
  }
}

export default AddAccount;