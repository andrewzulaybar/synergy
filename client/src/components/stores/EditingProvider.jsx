import React, { useReducer } from 'react';
import {
  EDIT_SELECTED,
  UPDATE_SELECTED,
  CANCEL_EDITING,
  UPDATE_TRANSACTIONS,
  HIDE_FOOTER,
  SHOW_FOOTER,
  ERROR,
} from "../../utils/misc/action-types";

const editingInitialState = {
  editingKey: '',
  selected: [],
  showFooter: false,
};

const EditingContext = React.createContext(editingInitialState);

const editingReducer = (state, action) => {
  switch (action.type) {
    case EDIT_SELECTED:
      return {...state, editingKey: action.key};
    case UPDATE_SELECTED:
      return {...state, selected: action.selected};
    case CANCEL_EDITING:
      return {...state, editingKey: ''};
    case UPDATE_TRANSACTIONS:
      return {
        ...state,
        editingKey: '',
        selected: [],
        showFooter: false
      };
    case SHOW_FOOTER:
      return {...state, showFooter: true};
    case HIDE_FOOTER:
      return {
        ...state,
        editingKey: '',
        selected: [],
        showFooter: false
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

const EditingProvider = props => {
  const [state, dispatch] = useReducer(editingReducer, editingInitialState);
  return (
    <EditingContext.Provider value={{ state, dispatch }}>
      {props.children}
    </EditingContext.Provider>
  );
};

export {
  editingInitialState,
  EditingContext,
  editingReducer,
  EditingProvider,
}