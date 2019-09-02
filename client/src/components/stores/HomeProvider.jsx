import React, { useReducer } from 'react';

import { FINISHED_LOADING } from '../../utils/misc/action-types';

const homeInitialState = {
  loading: 4,
  isLoading: true,
};

const HomeContext = React.createContext(homeInitialState);

const homeReducer = (state, action) => {
  switch (action.type) {
    case FINISHED_LOADING:
      return {
        ...state,
        loading: state.loading - 1,
        isLoading: (state.loading - 1 !== 0),
      };
    default:
      return state;
  }
};

const HomeProvider = props => {
  const [state, dispatch] = useReducer(homeReducer, homeInitialState);
  return (
    <HomeContext.Provider value={{ state, dispatch }}>
      {props.children}
    </HomeContext.Provider>
  );
};

export {
  homeInitialState,
  HomeContext,
  homeReducer,
  HomeProvider,
}