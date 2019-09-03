import { Col, Row } from 'antd';
import axios from 'axios';
import React from 'react';

/**
 * Retrieves accounts across all items.
 *
 * @returns {Promise<Array>} - The list of filtered accounts.
 */
async function getAccounts() {
  let accounts = [];
  await new Promise(resolve => {
    axios.get('/api/accounts')
      .then(res => {
        const data = res.data.accounts;
        accounts = filterAccounts(data);
        resolve();
      })
      .catch(error => console.log(error));
  });
  return accounts;
}

/**
 * Returns accounts that have names.
 *
 * @param {Object} data - The list of items (each associated with accounts).
 * @returns {Array} - The list of accounts that have names.
 */
function filterAccounts(data) {
  let accounts = [];
  for (let i = 0; i < data.length; i++) {
    for (const [, value] of Object.entries(data[i])) {
      if (value.name)
        accounts.push(value);
    }
  }
  return accounts;
}

/**
 * Calculates sum of debt, savings, and wealth from given accounts.
 *
 * @param {Array} accounts - The accounts of the user.
 * @returns {Object} - The object containing the sum of debt, savings, and wealth.
 */
function calculateSummary(accounts) {
  let debt = 0.00, savings = 0.00, wealth = 0.00;
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    const balance = acc.balances.current;
    if (acc.type === 'depository') {
      if (acc.subtype === 'checking')
        wealth += balance;
      else if (acc.subtype === 'savings')
        savings += balance;
    } else if (acc.type === 'credit')
      debt += balance;
  }
  return {
    debt: debt.toFixed(2),
    savings: savings.toFixed(2),
    wealth: wealth.toFixed(2),
  };
}

/**
 * Generates format for accounts in allAccounts that match type.
 *
 * @param type - The type of account to use as a filter.
 * @param allAccounts - The entire list of accounts.
 * @returns {Array} - The array of the formatted list of accounts.
 */
function formatAccounts(type, allAccounts) {
  const accounts = [];
  for (let i = 0; i < allAccounts.length; i++) {
    const account = allAccounts[i];
    if (account.type === type) {
      const balance = account.balances.current;
      accounts.push(
        <Row type="flex" justify="space-around" align="middle">
          <Col span={18} align="left">
            <p>{account.official_name}</p>
          </Col>
          <Col span={6} align="right">
            <p id="balance">$ {balance.toFixed(2)}</p>
          </Col>
        </Row>
      );
    }
  }
  return accounts;
}

export {
  getAccounts,
  calculateSummary,
  formatAccounts,
}