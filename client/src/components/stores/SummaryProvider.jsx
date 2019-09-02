import React, { useEffect, useReducer } from 'react';

import {
  ERROR,
  FINISHED_LOADING,
  LOADING,
  UPDATE_WEEK_EXPENSES,
  UPDATE_MONTH_EXPENSES,
  UPDATE_MONTH_INCOME,
} from '../../utils/misc/action-types';
import { updateWeeklyExpenses, updateMonthlyExpenses, updateMonthlyIncome } from '../../utils/summary/summary';

const summaryInitialState = {
  weekExpenses: 0,
  weekExpensesPercent: 0,
  monthExpenses: 0,
  monthExpensesPercent: 0,
  monthIncome: 0,
  monthIncomePercent: 0,
};

const SummaryContext = React.createContext(summaryInitialState);

const summaryReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_WEEK_EXPENSES:
      return {
        ...state,
        weekExpenses: action.expenses,
        weekExpensesPercent: action.percent,
      };
    case UPDATE_MONTH_EXPENSES:
      return {
        ...state,
        monthExpenses: action.expenses,
        monthExpensesPercent: action.percent,
      };
    case UPDATE_MONTH_INCOME:
      return {
        ...state,
        monthIncome: action.expenses,
        monthIncomePercent: action.percent,
      };
    case LOADING:
      return {...state, loading: true};
    case FINISHED_LOADING:
      return {...state, loading: false};
    case ERROR:
      return {...state, loading: false, error: action.error};
    default:
      return state;
  }
};

const SummaryProvider = props => {
  const [state, dispatch] = useReducer(summaryReducer, summaryInitialState);
  const { finishedLoading } = props;

  // retrieves summary if component did mount
  useEffect(() => {
    // calculates summary statistics
    async function fetchSummary() {
      dispatch({ type: LOADING });
      try {
        const promises = [];
        promises.push(updateWeeklyExpenses());
        promises.push(updateMonthlyExpenses());
        promises.push(updateMonthlyIncome());
        const [weekExpenses, monthExpenses, monthIncome] = await Promise.all(promises);
        updateStateSummary(weekExpenses, UPDATE_WEEK_EXPENSES);
        updateStateSummary(monthExpenses, UPDATE_MONTH_EXPENSES);
        updateStateSummary(monthIncome, UPDATE_MONTH_INCOME);
        dispatch({ type: FINISHED_LOADING });
      } catch (error) {
        dispatch({ type: ERROR });
      }
    }

    // updates state with summary statistics
    function updateStateSummary(summary, type) {
      const current = summary.current;
      const previous = summary.previous;
      dispatch({
        type: type,
        expenses: current.toFixed(2),
        percent: Math.round((previous !== 0)
          ? (current - previous) / previous * 100
          : current
        ),
      });
    }

    fetchSummary().then(() => finishedLoading());
  }, []);

  return (
    <SummaryContext.Provider value={{ state, dispatch }}>
      {props.children}
    </SummaryContext.Provider>
  );
};

export { SummaryContext, SummaryProvider };