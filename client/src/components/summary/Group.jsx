import React, { Component } from 'react';
import axios from 'axios';

import Summary from './Summary';
import { createDate, formatDate } from '../../utils/date';


// retrieves period summary according to type (expenses or income)
async function getPeriodSummary(start, end, type) {
  let total = 0;
  await axios.get('api/transactions/summary', {
    params: {
      type: type,
      start: start,
      end: end,
    }
  })
    .then(res => total = Math.abs(res.data.summary.sum))
    .catch(error => console.log(error));
  return total;
}

class Group extends Component {
  state = {
    weeklyExpenses: 0,
    weeklyExpensesPercentChange: 0,
    monthlyExpenses: 0,
    monthlyExpensesPercentChange: 0,
    monthlyIncome: 0,
    monthlyIncomePercentChange: 0,
  };

  componentDidMount() {
    const { subject } = this.props;
    subject.addObserver(this);
    this.update();
  }

  // called when transactions have been updated: updates summary cards
  update() {
    this.updateWeeklyExpenses();
    this.updateMonthlyExpenses();
    this.updateMonthlyIncome();
  }

  // helper for retrieving summary for current period and previous period
  retrievePeriodSummary(lastPeriodStart, thisPeriodStart, thisPeriodEnd, type) {
    let summaryType = type.toLowerCase().includes('income') ? 'income' : 'expenses';
    getPeriodSummary(thisPeriodStart, thisPeriodEnd, summaryType)
      .then(thisPeriodTotal =>
        getPeriodSummary(lastPeriodStart, thisPeriodStart, summaryType)
          .then(lastPeriodTotal =>
            this.updateState(thisPeriodTotal, lastPeriodTotal, type)
          )
          .catch(error => console.log(error))
      )
      .catch(error => console.log(error))
  }

  // helper for updating state
  updateState = (currentPeriodTotal, previousPeriodTotal, type) => {
    let typePercentChange = type + 'PercentChange';
    this.setState({
      [type]: currentPeriodTotal.toFixed(2),
      [typePercentChange]:
        Math.round((previousPeriodTotal !== 0)
          ? (currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal * 100
          : currentPeriodTotal
        )
    });
  };

  // updates weekly expenses and percent change
  updateWeeklyExpenses() {
    let end = createDate();
    let thisWeekStart = createDate(7);
    let lastWeekStart = createDate(14);

    this.retrievePeriodSummary(lastWeekStart, thisWeekStart, end, 'weeklyExpenses');
  }

  // updates monthly expenses and percent change
  updateMonthlyExpenses() {
    let today = new Date();

    let end = formatDate(today);
    let thisMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));

    this.retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'monthlyExpenses');
  }

  // updates monthly income and percent change
  updateMonthlyIncome() {
    let today = new Date();

    let end = formatDate(today);
    let thisMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    let lastMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));

    this.retrievePeriodSummary(lastMonthStart, thisMonthStart, end, 'monthlyIncome');
  }

  render() {
    const {
      weeklyExpenses,
      weeklyExpensesPercentChange,
      monthlyExpenses,
      monthlyExpensesPercentChange,
      monthlyIncome,
      monthlyIncomePercentChange
    } = this.state;

    return(
      <>
        <Summary
          percent={weeklyExpensesPercentChange}
          title="Weekly Expenses"
          amount={weeklyExpenses}
        />
        <Summary
          percent={monthlyExpensesPercentChange}
          title="Monthly Expenses"
          amount={monthlyExpenses}
        />
        <Summary
          percent={monthlyIncomePercentChange}
          title="Monthly Income"
          amount={monthlyIncome}
        />
        <Summary
          percent={73}
          title="Monthly Savings"
          amount={150.00}
        />
      </>
    );
  }
}

export default Group;