const express = require('express');
const retrieveTransactions = require('../database/transactions');

const router = express.Router();

/**
 * GET list of transactions.
 */
router.get('/', (req, res) => {
  retrieveTransactions().then((transactions) => {
    res.send({ transactions: transactions });
  }).catch((error) => {
    res.send({ transactions: [] });
    console.log(error)
  });
});


/**
 * POST new transaction.
 */
router.post('/', (req, res) => {
  let transaction = {
    id: req.body.id,
    amount: req.body.amount,
    description: req.body.description,
    method: req.body.method,
    tags: req.body.tags,
    date: req.body.date,
  };
  res.send(transaction);
});

module.exports = router;
