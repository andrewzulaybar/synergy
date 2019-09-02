import { Form } from 'antd';
import React from 'react';

import { getInput, getFormRules } from '../../utils/transactions/editable-cell';
import { EditableContext } from './ListOfTransactions';

const EditableCell = props => {
  // handles cell rendering according to type
  const renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      record,
      children,
      ...restProps
    } = props;

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

  return (
    <EditableContext.Consumer>
      {renderCell}
    </EditableContext.Consumer>
  );
};

export default EditableCell;