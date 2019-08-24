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

export {
  calculateSummary,
  filterAccounts,
}