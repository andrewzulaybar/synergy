import { Select } from 'antd';
import axios from 'axios';
import React from 'react';

/**
 * Amount validation rules.
 */
const amountRules = [
  {
    required: true,
    message: 'Please enter an amount!',
  },
  {
    pattern: /^(-?[0-9])+(\.[0-9]{2})?$/,
    message: 'Please enter a valid amount!',
  }
];

/**
 * Description validation rules.
 */
const descriptionRules = [
  {
    required: true,
    message: 'Please enter a description!',
    whitespace: true
  }
];

/**
 * Method validation rules.
 */
const methodRules = [
  {
    required: true,
    message: 'Please select a payment method!',
    whitespace: true
  }
];

/**
 * Date validation rules.
 */
const dateRules = [
  {
    required: true,
    message: 'Please select a date!',
  }
];

/**
 * The list of accounts, formatted for option selection.
 */
let listOfMethods = (() => getMethods())();

/**
 * The list of tags, formatted for option selection.
 */
let listOfTags = (() => getTags())();

/**
 * Retrieves list of accounts from API and formats selection.
 */
function getMethods() {
  getAccountNames()
    .then(accountNames => listOfMethods = formatOptions(accountNames))
    .catch(error => console.log(error));
}

/**
 * Retrieves account names from API.
 *
 * @returns {Promise<Array>} - The list of account names.
 */
async function getAccountNames() {
  const methods = [];
  await new Promise(resolve => {
    axios.get('api/accounts/')
      .then(res => {
        const data = res.data.accounts;
        for (let i = 0; i < data.length; i++)
          for (const [, value] of Object.entries(data[i]))
            methods.push(value.official_name);
        resolve();
      })
      .catch(error => console.log(error));
  });
  return methods;
}

/**
 * Retrieves list of tags from API and formats selection.
 */
function getTags() {
  getTagNames()
    .then(tagNames => listOfTags = formatOptions(tagNames))
    .catch(error => console.log(error));
}

/**
 * Retrieves distinct tags from API.
 *
 * @returns {Promise<Array>} - The list of distinct tags.
 */
async function getTagNames() {
  let tags = [];
  await new Promise(resolve => {
    axios.get('api/transactions/tags')
      .then(res => {
        tags = res.data.tags;
        resolve();
      })
      .catch(error => console.log(error))
  });
  return tags;
}

/**
 * Formats given list of options for selection.
 *
 * @param {string[]} options - The list of options.
 * @returns {Array} - The formatted list of options,
 */
function formatOptions(options) {
  const formattedOptions = [];
  options.forEach(option =>
    formattedOptions.push(
      <Select.Option key={option} value={option}>
        {option}
      </Select.Option>
    )
  );
  return formattedOptions;
}

export {
  amountRules,
  descriptionRules,
  methodRules,
  dateRules,
  listOfMethods,
  listOfTags
}