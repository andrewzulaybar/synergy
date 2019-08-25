import { green, red } from '@ant-design/colors';
import { Tag } from 'antd';
import axios from 'axios';
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

  // format amount column
  let amountIndex = schema.indexOf('Amount');
  columns[amountIndex].width = '15%';
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

  // format description column
  const descriptionIndex = schema.indexOf('Description');
  columns[descriptionIndex].width = '20%';

  // format methods column
  const methodIndex = schema.indexOf('Method');
  columns[methodIndex].width = '15%';

  // format tags column
  const tagsIndex = schema.indexOf('Tags');
  columns[tagsIndex].width = '30%';
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

  // format date column
  const dateIndex = schema.indexOf('Date');
  columns[dateIndex].width = '15%';

  return columns;
})();

/**
 * Retrieves list of transactions.
 *
 * @returns {Promise<Object[]>} - The current list of transactions.
 */
async function getTransactions() {
  let transactions = [];
  await new Promise(resolve => {
    axios.get('/api/transactions')
      .then(res => {
        transactions = res.data.transactions;
        resolve();
      })
      .catch(error => console.log(error))
  });
  return transactions;
}

/**
 * Creates new transaction on server and returns updated list of transactions.
 *
 * @param {Object} transaction - Object containing information about the transaction to create.
 * @param {Object[]} list - The current list of transactions.
 * @returns {Promise<Object[]>} - The updated list of transactions (i.e. after inserting the new transaction).
 */
async function createNewTransaction(transaction, list) {
  let newTransaction = {
    amount: transaction.amount,
    description: transaction.description,
    method: transaction.method,
    tags: transaction.tags,
    date: transaction.date
  };
  await new Promise(resolve => {
    axios.post('/api/transactions', newTransaction)
      .then(res => {
        newTransaction = res.data.transaction;
        resolve();
      })
      .catch(error => console.log(error));
  });
  return insertNewTransaction(newTransaction, list)
}

/**
 * Updates the transaction that matches the given ID.
 *
 * @param {Object} transaction - The updated fields for the transaction.
 * @param {string} id - The ID of the transaction to update.
 * @param {Object[]} list - The current list of transactions.
 * @returns {Promise<Object[]>} - The updated list of transactions.
 */
async function updateTransaction(transaction, id, list) {
  const index = list.findIndex(item => id === item._id);
  list.splice(index, 1);

  let newList = [];
  await new Promise(resolve => {
    axios.put('api/transactions/' + id, transaction)
      .then(res => {
        res.data.transaction.date = res.data.transaction.date.split('T')[0];
        newList = insertNewTransaction({...res.data.transaction}, list);
        resolve();
      })
      .catch(error => console.log(error));
  });
  return newList;
}

/**
 * Inserts new transaction into current list of transactions.
 *
 * @param {Object} transaction - The transaction to insert.
 * @param {Object[]} list - The current list of transactions.
 * @returns {Object[]} - The updated list of transactions (i.e. after inserting the new transaction).
 */
function insertNewTransaction(transaction, list) {
  let i = 0;
  while (i < list.length && list[i].date > transaction.date) i++;
  list.splice(i, 0, transaction);
  return list;
}

/**
 * Removes given transactions from current state given IDs.
 *
 * @param {string[]} transactionIDs - The IDs of the transactions to delete.
 * @param {Object[]} list - The current list of transactions.
 * @returns {Promise<Object[]>} - The updated list of transactions (i.e. after deleting the given transactions).
 */
async function deleteTransactions(transactionIDs, list) {
  const data = { data: { transactionIDs: transactionIDs }};
  let deletedTransactionIDs = [];
  await new Promise(resolve => {
    axios.delete('/api/transactions', data)
      .then(res => {
        deletedTransactionIDs = res.data.transactionIDs;
        resolve();
      })
  });
  return list.filter(element => !deletedTransactionIDs.includes(element._id));
}

export {
  columns,
  getTransactions,
  createNewTransaction,
  updateTransaction,
  deleteTransactions,
};