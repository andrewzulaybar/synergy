import axios from 'axios';
import React, { useContext } from 'react';
import PlaidLink from 'react-plaid-link';

import { AccountsContext } from '../stores/AccountsProvider';
import { calculateSummary, getAccounts } from '../../utils/accounts/accounts';
import { ACCOUNTS, SUMMARY } from '../../utils/misc/action-types';

const AddAccount = () => {
  const { dispatch: accountsDispatch } = useContext(AccountsContext);

  // called when account link is successful
  const handleOnSuccess = token => {
    const body = { publicToken: token };
    axios.post('/api/accounts/', body)
      .then(async () => {
        const accounts = await getAccounts();
        accountsDispatch({ type: ACCOUNTS, accounts: accounts });
        accountsDispatch({ type: SUMMARY, summary: calculateSummary(accounts) });
      })
      .catch(error => console.log(error));
  };

  return (
    <PlaidLink
      className="ant-btn"
      clientName="Synergy"
      countryCodes={['US', 'CA']}
      env="development"
      product={["transactions"]}
      publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
      onSuccess={handleOnSuccess}
      style={{}}
    >
      Add Account
    </PlaidLink>
  )
};

export default AddAccount;