import React, {useContext, useEffect, useReducer} from 'react';

import { HomeContext } from './HomeProvider';
import { UPDATE_TRANSACTIONS, ERROR, FINISHED_LOADING } from '../../utils/misc/action-types';
import { getTransactions } from '../../utils/transactions/transactions';

const transactionsInitialState = {
  transactions: []
};

const TransactionsContext = React.createContext(transactionsInitialState);

const transactionsReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_TRANSACTIONS:
      return {...state, transactions: action.transactions};
    case ERROR:
      return {...state, error: action.error};
    default:
      return state;
  }
};

const TransactionsProvider = props => {
  const [state, dispatch] = useReducer(transactionsReducer, transactionsInitialState);
  const { dispatch: homeDispatch } = useContext(HomeContext);

  // retrieves transactions if component did mount
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const transactions = await getTransactions();
        dispatch({type: UPDATE_TRANSACTIONS, transactions: transactions});
      } catch (error) {
        dispatch({type: ERROR});
      }
    }
    fetchTransactions().then(() => homeDispatch({ type: FINISHED_LOADING }));
  }, [homeDispatch]);

  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TransactionsContext.Provider>
  );
};

export { TransactionsContext, TransactionsProvider };