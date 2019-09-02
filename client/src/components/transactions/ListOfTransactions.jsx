import { Button, Card, Col, Form, Row, Skeleton, Table, Typography } from 'antd';
import React, { useContext } from 'react';

import AddTransaction from './AddTransaction';
import EditableCell from './EditableCell';
import { EditingContext } from '../stores/EditingProvider';
import { TransactionsContext } from '../stores/TransactionsProvider';
import {
  UPDATE_TRANSACTIONS,
  EDIT_SELECTED,
  UPDATE_SELECTED,
  CANCEL_EDITING,
  HIDE_FOOTER,
  SHOW_FOOTER,
  ERROR,
} from '../../utils/misc/action-types';
import { columns, deleteTransactions, updateTransaction } from '../../utils/transactions/transactions';
import './ListOfTransactions.css';

const ListOfTransactions = Form.create()(props => {
  const {
    state: transactionsState,
    dispatch: transactionsDispatch
  } = useContext(TransactionsContext);
  const {
    state: editingState,
    dispatch: editingDispatch
  } = useContext(EditingContext);

  // handler for deleting transaction(s)
  function handleDelete(e) {
    e.preventDefault();
    deleteTransactions([...editingState.selected], transactionsState.transactions)
      .then(list => {
        transactionsDispatch({ type: UPDATE_TRANSACTIONS, transactions: list });
        editingDispatch({ type: UPDATE_TRANSACTIONS })
      })
      .catch(error => {
        transactionsDispatch({ type: ERROR, error: error })
      });
  }

  // true if id is the same as the row currently being edited, false otherwise
  function isEditing(id) {
    return id === editingState.editingKey;
  }

  // updates editing key with the key of the row currently being edited
  function handleEdit(key) {
    editingDispatch({ type: EDIT_SELECTED, key: key });
  }

  // sets editing key to off transactionsState
  function handleCancel() {
    editingDispatch({ type: CANCEL_EDITING });
  }

  // handler for updating transaction
  function save(form, key){
    form.validateFields((error, row) => {
      if (error)
        return console.log(error);
      processTransaction(row, key)
    });
  }

  // helper for processing transaction
  function processTransaction(row, key) {
    const transaction = {
      transaction: {
        'amount': row.amount,
        'description': row.description,
        'method': row.method,
        'date': row.date,
        'tags': row.tags || [],
      }
    };
    updateTransaction(transaction, key, transactionsState.transactions)
      .then(list => {
        transactionsDispatch({type: UPDATE_TRANSACTIONS, transactions: list});
        editingDispatch({type: CANCEL_EDITING});
      })
      .catch(error =>
        transactionsDispatch({type: ERROR, error: error})
      );
  }

  const cols = columns.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record._id),
      }),
    };
  });

  const components = {
    body: { cell: EditableCell }
  };

  const deleteButton = <Button onClick={handleDelete}>Delete</Button>;
  const editButton = <Button onClick={() => handleEdit(editingState.selected[0])}>Edit</Button>;
  const cancelButton = <Button onClick={handleCancel}>Cancel</Button>;
  const saveButton = (
    <EditableContext.Consumer>
      {form => <Button onClick={() => save(form, editingState.editingKey)}>Save</Button>}
    </EditableContext.Consumer>
  );

  let footer;
  if (editingState.showFooter) {
    if (editingState.selected.length === 1) {
      // if currently editing some entry...
      if (editingState.editingKey !== '')
        footer = () => <Button.Group>{cancelButton}{saveButton}</Button.Group>;
      // else, only 1 entry is selected and not editing
      else
        footer = () => <Button.Group>{editButton}{deleteButton}</Button.Group>
    }
    // else more than 1 entry is selected
    else footer = () => deleteButton;
  }
  // else no entries are selected
  else footer = undefined;

  const header = (
    <Row>
      <Col span={12} align="left">
        <Typography.Title level={2}>
          Transactions
        </Typography.Title>
      </Col>
      <Col span={12} align="right">
        <AddTransaction />
      </Col>
    </Row>
  );

  const rowSelection = {
    onChange: (selected) => {
      try {
        editingDispatch({ type: UPDATE_SELECTED, selected: selected });
        if (selected.length === 0)
          editingDispatch({ type: HIDE_FOOTER });
        else
          editingDispatch({ type: SHOW_FOOTER })
      } catch (error) {
        editingDispatch({ type: ERROR, error: error });
      }
    },
  };

  return (
    <Col {...props.span}>
      <Card className="transactions" title={header} bordered={false}>
        {transactionsState.loading
          ? <Skeleton active paragraph={{ rows: 6 }} />
          : <Row>
              <EditableContext.Provider value={props.form}>
                <Table
                  className="transactions"
                  columns={cols}
                  components={components}
                  dataSource={transactionsState.transactions}
                  pagination={{ position: 'bottom' }}
                  rowKey={record => { return record._id }}
                  rowSelection={rowSelection}
                  size="middle"
                  footer={footer}
                />
              </EditableContext.Provider>
            </Row>}
      </Card>
    </Col>
  );
});

export const EditableContext = React.createContext({});

export default ListOfTransactions;