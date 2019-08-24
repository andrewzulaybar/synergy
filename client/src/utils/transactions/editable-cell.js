import { Input, Select } from 'antd';
import React from 'react';

import {
  amountRules,
  dateRules,
  descriptionRules,
  methodRules,
  listOfMethods,
  listOfTags,
} from './add-transaction';

/**
 * Retrieves input box depending on given type.
 *
 * @param {string} type - The input type.
 * @returns {*} - The input box for the given type.
 */
function getInput(type) {
  switch (type) {
    case 'method': return (
      <Select allowClear>
        {listOfMethods}
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

/**
 * Retrieves input validation rules.
 *
 * @param {string} type - The input type.
 * @returns {Array} - The validation rules for the input box of the given type.
 */
function getFormRules(type) {
  switch (type) {
    case 'amount': return createCellRules(amountRules);
    case 'description': return createCellRules(descriptionRules);
    case 'method': return createCellRules(methodRules);
    case 'date': return createCellRules(dateRules);
    default: return [];
  }
}

/**
 * Generates validation rules with messages in small text.
 *
 * @param {Array} rules - The validation rules.
 * @returns {Array} - The validation rules with the message in small text.
 */
function createCellRules(rules) {
  let cellRules = [];
  rules.forEach(obj => {
    let newObj = {...obj};
    newObj.message = <small>{newObj.message}</small>;
    cellRules.push(newObj);
  });
  return cellRules;
}

export {
  getInput,
  getFormRules
};