import { Form } from 'antd';
import React, { Component } from 'react';

import { getInput, getFormRules } from '../../utils/transactions/editable-cell';
import { EditableContext } from './ListOfTransactions';

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