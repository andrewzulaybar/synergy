import { Button, Col, DatePicker, Form, Input, Modal, Select, Typography } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';

import './AddTransaction.css';

const amountRules = [
  {
    required: true,
    message: 'Please enter an amount!',
  },
  {
    pattern: /^(-?[0-9])+(\.[0-9]{2})?$/,
    message: 'Please enter a valid amount!',
  }
];

const descriptionRules = [
  {
    required: true,
    message: 'Please enter a description!',
    whitespace: true
  }
];

const methodRules = [
  {
    required: true,
    message: 'Please select a payment method!',
    whitespace: true
  }
];

const dateRules = [
  {
    required: true,
    message: 'Please select a date!',
  }
];

let listOfTags = [];

class AddTransaction extends Component {
  state = {
    confirmLoading: false,
    visible: false,
  };

  componentDidMount() {
    const { subject } = this.props;
    subject.addObserver(this);

    this.getTags();
  }

  // called when transactions have been updated: re-renders list of tags
  update() {
    this.getTags();
  }

  // retrieves list of distinct tags and formats tag options
  getTags = () => {
    axios.get('api/transactions/tags')
      .then(res => {
        const tags = [];
        res.data.tags.forEach(tag =>
          tags.push(
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          )
        );
        listOfTags = tags;
      })
      .catch(error => console.log(error));
  };

  // handler for opening modal
  handleOpen = () => {
    this.setState({ visible: true });
  };

  // handler for adding transaction and closing modal
  handleOk = () => {
    this.props.form.validateFields(
      (err, values) => {
        if (!err) {
          this.processTransaction(values);
          this.handleClose();
        }
      }
    );
  };

  // handler for closing modal
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // helper for closing modal
  handleClose = () => {
    this.setState({confirmLoading: true});
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 1000);
  };

  // helper for adding transaction
  processTransaction = (values) => {
    const transaction = {
      'amount': values.amount,
      'description': values.description,
      'method': values.method,
      'date': values.date.format('ll'),
      'tags': values.tags || [],
    };
    this.props.handleAdd(transaction);
  };

  render() {
    const { visible, confirmLoading } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    };

    const amount = (
      <Form.Item label="Amount" {...formItemLayout}>
        {getFieldDecorator('amount', {
          rules: amountRules,
        })(<Input placeholder="Enter a dollar amount" allowClear />)}
      </Form.Item>
    );
    const description = (
      <Form.Item label="Description" {...formItemLayout}>
        {getFieldDecorator('description', {
          rules: descriptionRules,
        })(<Input placeholder="Enter a description" allowClear />)}
      </Form.Item>
    );
    const method = (
      <Form.Item label="Method" {...formItemLayout}>
        {getFieldDecorator('method', {
          rules: methodRules,
        })(
          <Select placeholder="Select a method of payment" allowClear>
            <Select.Option value="Debit">Debit</Select.Option>
            <Select.Option value="Mastercard">Mastercard</Select.Option>
            <Select.Option value="Cash">Cash</Select.Option>
          </Select>,
        )}
      </Form.Item>
    );
    const date = (
      <Form.Item label="Date" {...formItemLayout}>
        {getFieldDecorator('date', {
          rules: dateRules,
        })(<DatePicker placeholder="Select a date" allowClear />)}
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

    const header = (
      <Typography.Title level={2}>
        Add Transaction
      </Typography.Title>
    );

    return (
      <>
        <Button onClick={this.handleOpen}>
          Add Transaction
        </Button>
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
              onClick={this.handleOk}
            >
              Add Transaction
            </Button>
          }
          onCancel={this.handleCancel}
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
  }
}

AddTransaction = Form.create({ name: 'add-transaction' })(AddTransaction);

export default AddTransaction;
export {
  amountRules,
  descriptionRules,
  methodRules,
  dateRules,
  listOfTags,
}