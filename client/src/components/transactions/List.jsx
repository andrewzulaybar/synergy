import { Button, Card, Col, Row, Skeleton, Table, Tag, Typography } from 'antd';
import { green, red } from '@ant-design/colors';
import axios from "axios";
import React, { Component } from 'react';

import Add from './Add';
import { TransactionsContext } from './Provider';
import '../../screens/home/Home.css';

const schema = [
  'Amount',
  'Description',
  'Method',
  'Tags',
  'Date'
];

const columns = (() => {
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
          - ${(-amount).toFixed(2)}
        </div>
      );
    } else {
      return (
        <div style={{color: green[3]}}>
          + ${(+amount).toFixed(2)}
        </div>
      );
    }
  };

  // format tags
  const tagsIndex = schema.indexOf('Tags');
  columns[tagsIndex].render = tags => (
    <span>
      {(tags)
        ? tags.map(tag => {
          return (
            <Tag key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })
        : []}
    </span>
  );

  return columns;
})();

class List extends Component {
  state = {
    selected: [],
    showButton: false,
  };

  // handler for deleting transaction(s)
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleDelete(this.state.selected);
  };

  render() {
    const { transactions, span } = this.props;

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

    const header = (
      <Row>
        <Col span={12} align="left">
          <Typography.Title level={2}>
            Transactions
          </Typography.Title>
        </Col>
        <Col span={12} align="right">
          <TransactionsContext.Consumer>
            {context => (<Add handleAdd={context.handleAdd} subject={context.subject} />)}
          </TransactionsContext.Consumer>
        </Col>
      </Row>
    );

    return (
      <Col {...span}>
        <Card className="transactions" title={header} bordered={false}>
          {(transactions.length === 0)
            ? <Skeleton active paragraph={{ rows: 6 }} />
            : <Row>
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
                          <Button onClick={this.handleSubmit}>
                            Delete
                          </Button>
                        )
                      }
                      : undefined
                  }
                />
              </Row>}
        </Card>
      </Col>
    );
  }
}

export default List;