require('dotenv').config();
const express = require('express');
const plaid = require('plaid');

const { addItem, getItems } = require('../database/accounts');

const router = express.Router();
const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET_KEY,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox
);

/**
 * Exchange public token for access token.
 */
router.post('/get_access_token', (req, res) => {
  client.exchangePublicToken(
    req.body.public_token,
    async (error, tokenResponse) => {
      if (error)
        console.log(error);

      const itemID = tokenResponse.item_id;
      const accessToken = tokenResponse.access_token;
      await addItem(1, itemID, accessToken);
      return res.json({ error: false });
    }
  );
});

/**
 * GET all accounts, across all items.
 */
router.get('/', (req, res) => {
  const accounts = [];
  getItems(1)
    .then(async items => {
      const promises = [];
      for (let i = 0; i < items.length; i++) {
        promises.push(
          getAccounts(items[i])
          .then(account => accounts.push(account))
          .catch(error => console.log(error))
        );
      }
      await Promise.all(promises);
      res.send({ accounts: accounts });
    })
    .catch(error => console.log(error));
});

/**
 * Retrieves all accounts associated with the given item.
 *
 * @param {object} item - The item ID and access token that identifies the item.
 * @returns {Promise<Object>} - Detailed information of the accounts associated with the item.
 */
async function getAccounts(item) {
  let response = {};
  await new Promise( resolve => {
    client.getAuth(item.accessToken, {}, (error, results) => {
      if (error)
        return new Error();

      response = {...results.accounts};
      if (results.numbers.ach.length > 0)
        response = {...response, ...results.numbers.ach };
      if (results.numbers.eft.length > 0)
        response = {...response, ...results.numbers.eft };
      resolve();
    })
  });
  return response;
}

module.exports = router;