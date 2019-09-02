import React, { useContext } from 'react';

import Summary from './Summary';
import { SummaryContext } from '../stores/SummaryProvider';

const SummaryGroup = props => {
  const { state: summaryState } = useContext(SummaryContext);
  const { isLoading } = props;

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