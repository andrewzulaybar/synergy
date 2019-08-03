import { Button, Card, Col, Row, Table, Tag, Typography } from 'antd';
import { green, red } from '@ant-design/colors';
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

const tagColors = {
  'clothes': 'blue',
  'income': 'green',
  'restaurants': 'red',
  'skincare': 'yellow',
  'travel': 'orange',
};

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
})();

class Table extends Component {
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
            {context => (<Add handleAdd={context.handleAdd} />)}
          </TransactionsContext.Consumer>
        </Col>
      </Row>
    );

    return (
      <Col {...span}>
        <Card className="transactions" title={header} bordered={false}>
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

export default Table;