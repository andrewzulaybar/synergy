import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from "axios";

class AddAccount extends Component {
  handleOnSuccess(token, metadata) {
    const body = {
      public_token: token,
      accounts: metadata.accounts,
      institution: metadata.institution,
      link_session_id: metadata.link_session_id,
    };
    axios.post('/api/accounts/get_access_token', body)
      .then(res => console.log(res))
      .catch(error => console.log(error));
  }

  render() {
    const styles = {};
    const publicKey = process.env.REACT_APP_PLAID_PUBLIC_KEY;
    const env = 'sandbox';

    return (
      <PlaidLink
        className="ant-btn"
        clientName="Synergy"
        countryCodes={['US', 'CA']}
        env={env}
        product={["transactions"]}
        publicKey={publicKey}
        onSuccess={this.handleOnSuccess}
        style={styles}
      >
        Add Account
      </PlaidLink>
    )
  }
}

export default AddAccount;