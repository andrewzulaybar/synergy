const express = require('express');
const {
  addNewTransaction,
  deleteTransactions,
  retrieveTransactions,
} = require('../database/transactions');

const router = express.Router();

/**
 * GET list of transactions.
 */
router.get('/', (req, res) => {
  retrieveTransactions()
    .then((transactions) => {
      res.send({ transactions: transactions });
    })
    .catch((error) => {
      res.send({ transactions: [] });
      console.log(error);
    });
});


/**
 * POST new transaction.
 */
router.post('/', (req, res) => {
  let transaction = {
    amount: req.body.amount,
    description: req.body.description,
    method: req.body.method,
    tags: req.body.tags,
    date: new Date(req.body.date),
  };

  addNewTransaction(transaction)
    .then((objectId) => {
      // assign transaction id
      transaction._id = objectId;
      // format display date: 'YYYY-MM-DD'
      transaction.date = transaction.date
        .toISOString()
        .split('T')[0];
      res.send(transaction);
    })
    .catch((error) => {
      console.log(error);
    })
});

/**
 * DELETE list of transactions.
 */
router.delete('/', (req, res) => {
  let transactionIDs = req.body.transactionIDs;

  deleteTransactions(transactionIDs)
    .then((IDs) => {
      res.send({ transactionIDs: IDs });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
