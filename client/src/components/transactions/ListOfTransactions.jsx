import { Button, Card, Col, Form, Row, Skeleton, Table, Tag, Typography } from 'antd';
import { green, red } from '@ant-design/colors';
import React, { Component } from 'react';

import AddTransaction from './AddTransaction';
import EditableCell from './EditableCell';
import { TransactionsContext } from './Provider';
import './ListOfTransactions.css';

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
      editable: true,
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

const EditableContext = React.createContext();

class ListOfTransactions extends Component {
  state = {
    editingKey: '',
    selected: [],
    showFooter: false,
  };

  componentDidMount() {
    const { subject } = this.props;
    subject.addObserver(this);
  }

  update() {
    // stub
  }

  // handler for deleting transaction(s)
  delete = e => {
    e.preventDefault();
    this.props.subject.handleDelete([...this.state.selected]);
    this.setState(currState => {
      currState.selected.length = 0;
      currState.editingKey = '';
      currState.showFooter = false;
    });
  };

  // true if id is the same as the row currently being edited, false otherwise
  isEditing = id => id === this.state.editingKey;

  // sets editing key to off state
  cancel = () => this.setState({ editingKey: '' });

  // updates editing key with the key of the row currently being edited
  edit = key => this.setState({ editingKey: key });

  // saves form data by updating API
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        console.log(error);
        return;
      }

      const transaction = {
        transaction: {
          'amount': row.amount,
          'description': row.description,
          'method': row.method,
          'date': row.date,
          'tags': row.tags || [],
        }
      };
      this.props.subject.handleUpdate(transaction, key);
      this.setState({ editingKey: '' })
    });
  };

  render() {
    const { subject, span } = this.props;
    const transactions = subject.state.transactions;

    const cols = columns.map(col => {
      if (!col.editable) return col;

      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record._id),
        }),
      };
    });

    const components = {
      body: { cell: EditableCell }
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
            {context => (
              <AddTransaction handleAdd={context.handleAdd} subject={context.subject} />
            )}
          </TransactionsContext.Consumer>
        </Col>
      </Row>
    );

    const rowSelection = {
      onChange: (selected) => {
        this.setState({ selected: selected }, () => {
          if (selected.length === 0)
            this.setState({ showFooter: false, editingKey: '' });
          else
            this.setState({ showFooter: true });
        });
      },
    };

    const deleteButton = <Button onClick={this.delete}>Delete</Button>;
    const editButton = <Button onClick={() => this.edit(this.state.selected[0])}>Edit</Button>;
    const cancelButton = <Button onClick={this.cancel}>Cancel</Button>;
    const saveButton = (
      <EditableContext.Consumer>
        {form => (
          <Button onClick={() => this.save(form, this.state.editingKey)}>Save</Button>
        )}
      </EditableContext.Consumer>
    );

    let footer;
    if (this.state.showFooter) {
      if (this.state.selected.length === 1) {
        // if currently editing some entry...
        if (this.state.editingKey !== '')
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

    return (
      <Col {...span}>
        <Card className="transactions" title={header} bordered={false}>
          {(transactions.length === 0)
            ? <Skeleton active paragraph={{ rows: 6 }} />
            : <Row>
                <EditableContext.Provider value={this.props.form}>
                  <Table
                    className="transactions"
                    columns={cols}
                    components={components}
                    dataSource={transactions}
                    pagination={{ position: 'bottom' }}
                    rowKey={(record) => { return record._id }}
                    rowSelection={rowSelection}
                    size="middle"
                    footer={footer}
                  />
                </EditableContext.Provider>
              </Row>}
        </Card>
      </Col>
    );
  }
}

ListOfTransactions = Form.create()(ListOfTransactions);

export { EditableContext };
export default ListOfTransactions;