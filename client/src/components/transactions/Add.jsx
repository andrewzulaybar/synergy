import { Button, Col, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { Component } from 'react';

class Add extends Component {
  state = {
    confirmLoading: false,
    visible: false,
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
          rules: [
            {
              required: true,
              message: 'Please enter an amount!',
            },
            {
              pattern: /^(-?[0-9])+(\.[0-9]{2})?$/,
              message: 'Please enter a valid amount!',
            }
          ],
        })(<Input placeholder="Enter a dollar amount" allowClear />)}
      </Form.Item>
    );
    const description = (
      <Form.Item label="Description" {...formItemLayout}>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Please enter a description!',
              whitespace: true
            }
          ],
        })(<Input placeholder="Enter a description" allowClear />)}
      </Form.Item>
    );
    const method = (
      <Form.Item label="Method" {...formItemLayout}>
        {getFieldDecorator('method', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true
            }
          ],
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
          rules: [
            {
              required: true,
              message: 'Please select a date!',
            }
          ],
        })(<DatePicker placeholder="Select a date" allowClear />)}
      </Form.Item>
    );
    const tags = (
      <Form.Item label="Tags" {...formItemLayout}>
        {getFieldDecorator('tags', {
          rules: [],
        })(
          <Select mode="tags" placeholder="Select optional tags" allowClear>
            <Select.Option value="clothes">clothes</Select.Option>
            <Select.Option value="income">income</Select.Option>
            <Select.Option value="restaurants">restaurants</Select.Option>
            <Select.Option value="skincare">skincare</Select.Option>
            <Select.Option value="travel">travel</Select.Option>
          </Select>
        )}
      </Form.Item>
    );

    return (
      <>
        <Button type="primary" onClick={this.handleOpen}>
          + Add Transaction
        </Button>
        <Modal
          centered
          closable={false}
          confirmLoading={confirmLoading}
          okText="Add Transaction"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          title="Add Transaction"
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

Add = Form.create({ name: 'add-transaction' })(Add);

export default Add;