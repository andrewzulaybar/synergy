import React, { useEffect, useReducer } from 'react';

import { UPDATE_TRANSACTIONS, ERROR, LOADING } from '../../utils/misc/action-types';
import { getTransactions } from '../../utils/transactions/transactions';

const transactionsInitialState = {
  transactions: []
};

const TransactionsContext = React.createContext(transactionsInitialState);

const transactionsReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_TRANSACTIONS:
      return {
        ...state,
        loading: false,
        transactions: action.transactions
      };
    case LOADING:
      return {...state, loading: true};
    case ERROR:
      return {...state, loading: false, error: action.error};
    default:
      return state;
  }
};

const TransactionsProvider = props => {
  const [state, dispatch] = useReducer(transactionsReducer, transactionsInitialState);
  const { finishedLoading } = props;

  // retrieves transactions if component did mount
  useEffect(() => {
    async function fetchTransactions() {
      dispatch({ type: LOADING });
      try {
        const transactions = await getTransactions();
        dispatch({type: UPDATE_TRANSACTIONS, transactions: transactions});
      } catch (error) {
        dispatch({type: ERROR});
      }
    }
    fetchTransactions().then(finishedLoading());
  }, []);

  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TransactionsContext.Provider>
  );
};

export { TransactionsContext, TransactionsProvider };