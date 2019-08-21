import { Form, Input, Select } from 'antd';
import React, { Component } from 'react';

import { amountRules, dateRules, descriptionRules, methodRules, listOfTags } from './AddTransaction';
import { EditableContext } from './ListOfTransactions';

// retrieves input box depending on input type
function getInput(type) {
  switch (type) {
    case 'method': return (
      <Select allowClear>
        <Select.Option value="Debit">Debit</Select.Option>
        <Select.Option value="Mastercard">Mastercard</Select.Option>
        <Select.Option value="Cash">Cash</Select.Option>
      </Select>
    );
    case 'tags': return (
      <Select mode="tags" allowClear>
        {listOfTags}
      </Select>
    );
    default: return <Input allowClear />;
  }
}

// retrieves input validation rules
function getFormRules(type) {
  switch (type) {
    case 'amount': return createCellRules(amountRules);
    case 'description': return createCellRules(descriptionRules);
    case 'method': return createCellRules(methodRules);
    case 'date': return createCellRules(dateRules);
    default: return [];
  }
}

// generates validation rules in small text
function createCellRules(rules) {
  let cellRules = [];
  rules.forEach(obj => {
    let newObj = {...obj};
    newObj.message = <small>{newObj.message}</small>;
    cellRules.push(newObj);
  });
  return cellRules;
}

class EditableCell extends Component {
  // handles cell rendering according to type
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      record,
      children,
      ...restProps
    } = this.props;

    return (
      <td {...restProps}>
        {editing
          ? (
            <Form.Item style={{ span: 24 }}>
              {getFieldDecorator(dataIndex, {
                rules: getFormRules(dataIndex),
                initialValue: record[dataIndex],
              })(getInput(dataIndex))}
            </Form.Item>
          )
          : children}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>
        {this.renderCell}
      </EditableContext.Consumer>
    );
  }
}

export default EditableCell;