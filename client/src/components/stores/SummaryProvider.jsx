import React, {useCallback, useContext, useEffect, useReducer} from 'react';

import { HomeContext } from './HomeProvider';
import {ERROR, FINISHED_LOADING, SUMMARY} from '../../utils/misc/action-types';
import {percentChange, retrieveSummary, toTwoDecimalPlaces} from "../../utils/summary/summary";
import {TransactionsContext} from "./TransactionsProvider";

const summaryInitialState = {
  isLoading: true,
  summary: {
    weekExpenses: 0,
    weekExpensesPercent: 0,
    monthExpenses: 0,
    monthExpensesPercent: 0,
    monthIncome: 0,
    monthIncomePercent: 0,
  }
};

const SummaryContext = React.createContext(summaryInitialState);

const summaryReducer = (state, action) => {
  switch (action.type) {
    case SUMMARY:
      const [weekExpenses, monthExpenses, monthIncome] = action.summary;
      return {
        ...state,
        summary: {
          weekExpenses: toTwoDecimalPlaces(weekExpenses.current),
          weekExpensesPercent: percentChange(weekExpenses),
          monthExpenses: toTwoDecimalPlaces(monthExpenses.current),
          monthExpensesPercent: percentChange(monthExpenses),
          monthIncome: toTwoDecimalPlaces(monthIncome.current),
          monthIncomePercent: percentChange(monthIncome),
        }
      };
    case FINISHED_LOADING:
      return {...state, isLoading: false};
    case ERROR:
      return {...state, error: action.error};
    default:
      return state;
  }
};

const SummaryProvider = props => {
  const [state, dispatch] = useReducer(summaryReducer, summaryInitialState);

  const { state: homeState, dispatch: homeDispatch } = useContext(HomeContext);
  const { state: transactionsState } = useContext(TransactionsContext);

  const fetchSummary = useCallback(async () => {
    try {
      const summary = await retrieveSummary();
      dispatch({ type: SUMMARY, summary: summary });
    } catch (error) {
      dispatch({ type: ERROR, error: error });
    }
  }, [dispatch]);

  // retrieves summary if component did mount
  useEffect(() => {
    fetchSummary().then(() => homeDispatch({ type: FINISHED_LOADING }));
  }, [homeDispatch, fetchSummary]);

  // retrieves summary if transactions have changed
  useEffect(() => {
    fetchSummary();
  }, [transactionsState, fetchSummary]);

  // sets isLoading to false once all components on Home page are finished loading
  useEffect(() => {
    if (!homeState.isLoading)
      dispatch({ type: FINISHED_LOADING });
  }, [homeState.isLoading]);

  return (
    <SummaryContext.Provider value={{ state, dispatch }}>
      {props.children}
    </SummaryContext.Provider>
  );
};

export { SummaryContext, SummaryProvider };