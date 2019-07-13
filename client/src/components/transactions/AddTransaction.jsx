import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Select,
    Typography
} from 'antd';
import React, { Component } from 'react';

import './AddTransaction.css';

class AddTransaction extends Component {
    handleSubmit = e => {
        e.preventDefault();

        const { clickHandler } = this.props;
        this.props.form.validateFields(
            (err, values) => {
                if (!err) {
                    const transaction = {
                        'amount': values.amount,
                        'description': values.description,
                        'method': values.method,
                        'date': values.date.format('ll'),
                        'tags': values.tags || [],
                    };
                    clickHandler(transaction)
                }
            });
    };

    render() {
        const { addTransactionSpan, clickHandler } = this.props;
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
                            pattern: /^[0-9]+(\.[0-9]{2})?$/,
                            message: 'Please enter a valid amount!',
                        }
                    ],
                })(<Input placeholder="Enter a dollar amount" />)}
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
                })(<Input placeholder="Enter a description"/>)}
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
                    <Select placeholder="Select a method of payment">
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
                })(
                    <DatePicker placeholder="Select a date" />
                )}
            </Form.Item>
        );
        const tags = (
            <Form.Item label="Tags" {...formItemLayout}>
                {getFieldDecorator('tags', {
                    rules: [],
                })(
                    <Select mode="tags" placeholder="Select optional tags">
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
            <Col className="add-transaction" {...addTransactionSpan}>
                <Typography.Title level={2}>
                    Add Transaction
                </Typography.Title>
                <Form {...formItemLayout} layout="vertical" onSubmit={this.handleSubmit}>
                    {amount}
                    {description}
                    {method}
                    {date}
                    {tags}
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            htmlType="submit"
                            type="primary"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        );
    }
}

AddTransaction = Form.create({ name: 'add-transaction' })(AddTransaction);

export default AddTransaction;
          