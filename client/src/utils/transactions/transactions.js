import { green, red } from '@ant-design/colors';
import { Tag } from 'antd';
import React from 'react';

/**
 * Schema for list of transactions table.
 *
 * @type {string[]} - The column headers.
 */
const schema = [
  'Amount',
  'Description',
  'Method',
  'Tags',
  'Date'
];

/**
 * The formatted columns for the list of transactions table.
 *
 * @type {Object[]} - The object array containing information about each column.
 */
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

export { columns };