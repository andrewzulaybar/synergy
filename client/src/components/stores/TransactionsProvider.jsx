import React, { useEffect, useReducer } from 'react';

import { UPDATE_TRANSACTIONS, ERROR, LOADING } from '../../utils/misc/action-types';
// import { updateWeeklyExpenses, updateMonthlyExpenses, updateMonthlyIncome } from '../../utils/summary/summary';
import { getTransactions } from '../../utils/transactions/transactions';

// class TransactionsProvider extends Component {
//   state = {
//     weekExpenses: 0,
//     weekExpensesPercent: 0,
//     monthExpenses: 0,
//     monthExpensesPercent: 0,
//     monthIncome: 0,
//     monthIncomePercent: 0,
//   };
//
//   componentDidMount() {
//     const { finishedLoading } = this.props;
//
//     updateWeeklyExpenses()
//       .then(summary => this.updateStateSummary(summary, 'weekExpenses', finishedLoading))
//       .catch(error => console.log(error));
//     updateMonthlyExpenses()
//       .then(summary => this.updateStateSummary(summary, 'monthExpenses', finishedLoading))
//       .catch(error => console.log(error));
//     updateMonthlyIncome()
//       .then(summary => this.updateStateSummary(summary, 'monthIncome', finishedLoading))
//       .catch(error => console.log(error));
//
//     this.props.onUpdate(this.onUpdate);
//   };
//
//   // refreshes summary cards on update
//   onUpdate = () => {
//     updateWeeklyExpenses()
//       .then(summary => this.updateStateSummary(summary, 'weekExpenses'))
//       .catch(error => console.log(error));
//     updateMonthlyExpenses()
//       .then(summary => this.updateStateSummary(summary, 'monthExpenses'))
//       .catch(error => console.log(error));
//     updateMonthlyIncome()
//       .then(summary => this.updateStateSummary(summary, 'monthIncome'))
//       .catch(error => console.log(error));
//   };
//
//   // helper for updating state summary
//   updateStateSummary(summary, type, callback = () => {}) {
//     const current = summary.current;
//     const previous = summary.previous;
//     const typePercent = type + 'Percent';
//     this.setState(
//       currState => {
//         currState[type] = current.toFixed(2);
//         currState[typePercent] =
//           Math.round((previous !== 0) ? (current - previous) / previous * 100 : current);
//         return currState;
//       },
//       () => callback()
//     );
//   }
//
//   render() {
//     return (
//       <TransactionsContext.Provider value={{
//         weekExpenses: this.state.weekExpenses,
//         weekExpensesPercent: this.state.weekExpensesPercent,
//         monthExpenses: this.state.monthExpenses,
//         monthExpensesPercent: this.state.monthExpensesPercent,
//         monthIncome: this.state.monthIncome,
//         monthIncomePercent: this.state.monthIncomePercent,
//       }}>
//         {this.props.children}
//       </TransactionsContext.Provider>
//     );
//   }
// }

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
  }, [finishedLoading]);

  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TransactionsContext.Provider>
  );
};

export { TransactionsContext, TransactionsProvider };