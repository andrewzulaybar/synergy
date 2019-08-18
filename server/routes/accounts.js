require('dotenv').config();
const express = require('express');
const plaid = require('plaid');

const { addItem } = require('../database/accounts');

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
      if (error !== null) {
        const msg = 'Could not exchange public_token!';
        console.log(msg + '\n' + error);
        return res.json({ error: msg });
      }

      const itemID = tokenResponse.item_id;
      const accessToken = tokenResponse.access_token;

      await addItem(1, itemID, accessToken);
      console.log('Item ID: ' + itemID);
      console.log('Access Token: ' + accessToken);
      res.json({ error: false });
    }
  );
});

module.exports = router;