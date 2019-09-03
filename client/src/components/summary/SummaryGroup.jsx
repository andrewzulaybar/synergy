import React, { useContext, useEffect, useState } from 'react';

import Summary from './Summary';
import { HomeContext } from '../stores/HomeProvider';
import { TransactionsContext } from '../stores/TransactionsProvider';
import { FINISHED_LOADING } from '../../utils/misc/action-types';
import {
  percentChange,
  toTwoDecimalPlaces,
  retrieveSummary
} from '../../utils/summary/summary';

const SummaryGroup = () => {
  const [summaryState, setSummaryState] =
    useState({
      weekExpenses: 0,
      weekExpensesPercent: 0,
      monthExpenses: 0,
      monthExpensesPercent: 0,
      monthIncome: 0,
      monthIncomePercent: 0,
    });

  const { state: homeState, dispatch: homeDispatch } = useContext(HomeContext);
  const { state: transactionsState } = useContext(TransactionsContext);

  // retrieves summary if component did mount
  useEffect(() => {
    retrieveSummary().then(([weekExpenses, monthExpenses, monthIncome]) => {
      setSummaryState({
        weekExpenses: toTwoDecimalPlaces(weekExpenses.current),
        weekExpensesPercent: percentChange(weekExpenses),
        monthExpenses: toTwoDecimalPlaces(monthExpenses.current),
        monthExpensesPercent: percentChange(monthExpenses),
        monthIncome: toTwoDecimalPlaces(monthIncome.current),
        monthIncomePercent: percentChange(monthIncome),
      });
      homeDispatch({ type: FINISHED_LOADING })
    });
  }, [homeDispatch]);

  // retrieves summary if transactions have changed
  useEffect(() => {
    retrieveSummary().then(([weekExpenses, monthExpenses, monthIncome]) => {
      setSummaryState({
        weekExpenses: toTwoDecimalPlaces(weekExpenses.current),
        weekExpensesPercent: percentChange(weekExpenses),
        monthExpenses: toTwoDecimalPlaces(monthExpenses.current),
        monthExpensesPercent: percentChange(monthExpenses),
        monthIncome: toTwoDecimalPlaces(monthIncome.current),
        monthIncomePercent: percentChange(monthIncome),
      });
    });
  }, [transactionsState]);

  return (
    <>
      <Summary
        title="Weekly Expenses"
        amount={summaryState.weekExpenses}
        percent={summaryState.weekExpensesPercent}
        isLoading={homeState.isLoading}
      />
      <Summary
        title="Monthly Expenses"
        amount={summaryState.monthExpenses}
        percent={summaryState.monthExpensesPercent}
        isLoading={homeState.isLoading}
      />
      <Summary
        title="Monthly Income"
        amount={summaryState.monthIncome}
        percent={summaryState.monthIncomePercent}
        isLoading={homeState.isLoading}
      />
    </>
  )
};

export default SummaryGroup;