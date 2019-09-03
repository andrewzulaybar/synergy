import React, {useEffect, useReducer} from 'react';

import { calculateSummary, getAccounts } from '../../utils/accounts/accounts';
import { ACCOUNTS, ERROR, FINISHED_LOADING, SUMMARY } from '../../utils/misc/action-types';

const accountsInitialState = {
  isLoading: true,
  accounts: [],
  summary: {
    wealth: 0.00,
    debt: 0.00,
    savings: 0.00,
  },
};

const AccountsContext = React.createContext(accountsInitialState);

const accountsReducer = (state, action) => {
  switch (action.type) {
    case ACCOUNTS:
      return {...state, accounts: action.accounts};
    case SUMMARY:
      return {...state, summary: action.summary};
    case FINISHED_LOADING:
      return {...state, isLoading: false};
    case ERROR:
      return {...state, error: action.error};
    default:
      return state;
  }
};

const AccountsProvider = props => {
  const [state, dispatch] = useReducer(accountsReducer, accountsInitialState);

  useEffect(() => {
    async function retrieveAccountsSummary() {
      try {
        const accounts = await getAccounts();
        dispatch({ type: ACCOUNTS, accounts: accounts });
        dispatch({ type: SUMMARY, summary: calculateSummary(accounts) });
      } catch (error) {
        dispatch({ type: ERROR });
      }
    }
    retrieveAccountsSummary()
      .then(() => dispatch({ type: FINISHED_LOADING }));
  }, []);

  return (
    <AccountsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AccountsContext.Provider>
  );
};

export {
  accountsInitialState,
  AccountsContext,
  accountsReducer,
  AccountsProvider,
}