import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Typography
} from 'antd';
import { green, red } from '@ant-design/colors';
import React, { Component } from 'react';

import './Transactions.css';

const schema = [
  'Amount',
  'Description',
  'Method',
  'Tags',
  'Date'
];

const tagColors = {
  'clothes': 'blue',
  'income': 'green',
  'restaurants': 'red',
  'skincare': 'yellow',
  'travel': 'orange',
};

const columns = initializeColumns();
function initializeColumns() {
  let columns = [];
  for (let i = 0; i < schema.length; i++) {
    const item = {
      title: schema[i],
      dataIndex: schema[i].toLowerCase(),
      key: schema[i].toLowerCase(),
    };
    columns.push(item);
  }

  // format amount
  let amountIndex = schema.indexOf('Amount');
  columns[amountIndex].render = amount => {
    if (amount < 0) {
      return (
        <div style={{color: red[4]}}>
          - ${-amount}
        </div>
      );
    } else {
      return (
        <div style={{color: green[3]}}>
          + ${amount}
        </div>
      );
    }
  };

  // format tags
  let tagsIndex = schema.indexOf('Tags');
  columns[tagsIndex].render = tags => (
    <span>
      {(tags)
        ? tags.map(tag => {
          let color = tagColors[tag];
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })
        : []}
    </span>
  );

  return columns;
}

class Transactions extends Component {
  state = {
    confirmLoading: false,
    selected: [],
    showButton: false,
    visible: false,
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

  // handler for opening modal
  handleOpen = () => {
    this.setState({ visible: true });
  };

  // handler for deleting transaction(s)
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleDelete(this.state.selected);
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
    const { transactions, span } = this.props;
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

    const rowSelection = {
      onChange: (selected) => {
        this.setState({ selected: selected });

        if (selected.length === 0) {
          this.setState({ showButton: false })
        } else {
          this.setState({ showButton: true });
        }
      },
    };

    return (
      <Col {...span}>
        <Card className="transactions-list">
          <Row>
            <Col span={12} align="left">
              <Typography.Title level={2}>
                Transactions
              </Typography.Title>
            </Col>
            <Col span={12} align="right">
              <Button type="primary" onClick={this.handleOpen}>
                + Add Transaction
              </Button>
              <Modal
                centered
                confirmLoading={confirmLoading}
                okText="Add Transaction"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                title="Add Transaction"
                visible={visible}
              >
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                  <Col className="add-transaction">
                    {amount}
                    {description}
                    {method}
                    {date}
                    {tags}
                  </Col>
                </Form>
              </Modal>
            </Col>
          </Row>
          <Row>
            <Table
              className="transactions"
              columns={columns}
              dataSource={transactions}
              pagination={{ position: 'bottom' }}
              rowKey={(record) => { return record._id }}
              rowSelection={rowSelection}
              size="middle"
              footer={
                (this.state.showButton)
                  ? () => {
                    return (
                      <Button onClick={this.handleSubmit}  type="primary">
                        Delete
                      </Button>
                    )
                  }
                  : undefined
              }
            />
          </Row>
        </Card>
      </Col>
    );
  }
}

Transactions = Form.create({ name: 'add-transaction' })(Transactions);

export default Transactions;