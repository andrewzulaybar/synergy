import { Button, Col, DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useContext, useState } from 'react';

import { TransactionsContext } from '../stores/TransactionsProvider';
import { UPDATE_TRANSACTIONS, LOADING, ERROR } from '../../utils/misc/action-types';
import {
  amountRules,
  descriptionRules,
  methodRules,
  dateRules,
  listOfMethods,
  listOfTags
} from '../../utils/transactions/add-transaction';
import { createNewTransaction } from '../../utils/transactions/transactions';
import './AddTransaction.css';

const AddTransaction = Form.create()(props => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const { state, dispatch } = useContext(TransactionsContext);

  // handler for opening modal
  function handleOpen() {
    setVisible(true);
  }

  // handler for closing modal
  function handleCancel() {
    setVisible(false);
  }

  // handler for adding transaction and closing modal
  function handleOk() {
    setConfirmLoading(true);
    props.form.validateFields(
      (err, values) => {
        if (!err) {
          processTransaction(values)
            .then(() => {
              setConfirmLoading(false);
              setVisible(false);
            })
            .catch(error => {
              console.log(error)
            });
        }
      }
    );
  }

  // helper for processing transaction
  async function processTransaction(values) {
    dispatch({ type: LOADING });
    const transaction = {
      'amount': values.amount,
      'description': values.description,
      'method': values.method,
      'date': values.date.format('ll'),
      'tags': values.tags || [],
    };
    return new Promise((resolve, reject) => {
      createNewTransaction(transaction, state.transactions)
        .then(transactions => {
          dispatch({ type: UPDATE_TRANSACTIONS, transactions: transactions });
          resolve();
        })
        .catch(error => {
          dispatch({ type: ERROR, error: error });
          reject();
        });
    });
  }

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const amount = (
    <Form.Item label="Amount" {...formItemLayout}>
      {getFieldDecorator('amount', {
        rules: amountRules,
      })(<Input placeholder="Enter a dollar amount" allowClear/>)}
    </Form.Item>
  );

  const description = (
    <Form.Item label="Description" {...formItemLayout}>
      {getFieldDecorator('description', {
        rules: descriptionRules,
      })(<Input placeholder="Enter a description" allowClear/>)}
    </Form.Item>
  );

  const method = (
    <Form.Item label="Method" {...formItemLayout}>
      {getFieldDecorator('method', {
        rules: methodRules,
      })(
        <Select placeholder="Select a method of payment" allowClear>
          {listOfMethods}
        </Select>,
      )}
    </Form.Item>
  );

  const date = (
    <Form.Item label="Date" {...formItemLayout}>
      {getFieldDecorator('date', {
        rules: dateRules,
      })(<DatePicker placeholder="Select a date" allowClear/>)}
    </Form.Item>
  );

  const tags = (
    <Form.Item label="Tags" {...formItemLayout}>
      {getFieldDecorator('tags', {
        rules: [],
      })(
        <Select mode="tags" placeholder="Select optional tags" allowClear>
          {listOfTags}
        </Select>
      )}
    </Form.Item>
  );

  const header = <h2 className="ant-typography">Add Transaction</h2>;

  return (
    <>
      <Button onClick={handleOpen}>Add Transaction</Button>
      <Modal
        centered
        confirmLoading={confirmLoading}
        destroyOnClose={true}
        footer={
          <Button
            block
            key="submit"
            loading={confirmLoading}
            type="primary"
            onClick={handleOk}
          >
            Add Transaction
          </Button>
        }
        onCancel={handleCancel}
        title={header}
        visible={visible}
      >
        <Form layout="vertical">
          <Col className="add-transaction">
            {amount}
            {description}
            {method}
            {date}
            {tags}
          </Col>
        </Form>
      </Modal>
    </>
  )
});

export default AddTransaction;