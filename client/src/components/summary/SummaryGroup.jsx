import React, { useContext, useEffect, useState } from 'react';

import Summary from './Summary';
import { HomeContext } from '../stores/HomeProvider';
import { FINISHED_LOADING } from '../../utils/misc/action-types';
import {
  percentChange,
  toTwoDecimalPlaces,
  updateMonthlyExpenses,
  updateMonthlyIncome,
  updateWeeklyExpenses
} from '../../utils/summary/summary';

const SummaryGroup = ({ isLoading }) => {
  const [summaryState, setSummaryState] =
    useState({
      weekExpenses: 0,
      weekExpensesPercent: 0,
      monthExpenses: 0,
      monthExpensesPercent: 0,
      monthIncome: 0,
      monthIncomePercent: 0,
    });
  const { dispatch: homeDispatch } = useContext(HomeContext);

  // retrieves summary if component did mount
  useEffect(() => {
    // calculates summary statistics
    async function fetchSummary() {
      const promises = [updateWeeklyExpenses(), updateMonthlyExpenses(), updateMonthlyIncome()];
      const [weekExpenses, monthExpenses, monthIncome] = await Promise.all(promises);
      setSummaryState({
        weekExpenses: toTwoDecimalPlaces(weekExpenses.current),
        weekExpensesPercent: percentChange(weekExpenses),
        monthExpenses: toTwoDecimalPlaces(monthExpenses.current),
        monthExpensesPercent: percentChange(monthExpenses),
        monthIncome: toTwoDecimalPlaces(monthIncome.current),
        monthIncomePercent: percentChange(monthIncome),
      });
    }

    fetchSummary().then(() => homeDispatch({ type: FINISHED_LOADING }));
  }, []);

  return (
    <>
      <Summary
        percent={summaryState.weekExpensesPercent}
        title="Weekly Expenses"
        amount={summaryState.weekExpenses}
        isLoading={isLoading}
      />
      <Summary
        percent={summaryState.monthExpensesPercent}
        title="Monthly Expenses"
        amount={summaryState.monthExpenses}
        isLoading={isLoading}
      />
      <Summary
        percent={summaryState.monthIncomePercent}
        title="Monthly Income"
        amount={summaryState.monthIncome}
        isLoading={isLoading}
      />
    </>
  )
};

export default SummaryGroup;