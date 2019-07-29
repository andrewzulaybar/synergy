const express = require('express');

const { checkErrors, summaryValidator } = require('../validators/summary');
const {
  addNewTransaction,
  deleteTransactions,
  retrieveSummary,
  retrieveTags,
  retrieveTransactions,
} = require('../database/transactions');

const router = express.Router();

/**
 * GET list of transactions.
 */
router.get('/', (req, res) => {
  retrieveTransactions()
    .then(transactions => {
      res.send({ transactions: transactions });
    })
    .catch(error => {
      res.send({ transactions: [] });
      console.log(error);
    });
});

/**
 * GET summary statistics.
 */
router.get('/summary', summaryValidator, (req, res) => {
  checkErrors(req, res);

  let type = req.query.type || null;
  let tag = req.query.tag || null;
  let start = req.query.start
    ? new Date(req.query.start)
    : null;
  let end = req.query.end
    ? new Date(req.query.end)
    : null;

  retrieveSummary(type, tag, start, end)
    .then(summary => {
      res.send({ summary: summary });
    })
    .catch(error => {
      console.log(error);
    });
});

/**
 * GET list of distinct tags.
 */
router.get('/tags', (req, res) => {
  retrieveTags()
    .then(tags => {
      res.send({ tags: tags });
    })
    .catch(error => {
      res.send({ tags: [] });
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
    .then(objectId => {
      // assign transaction id
      transaction._id = objectId;
      // format display date: 'YYYY-MM-DD'
      transaction.date = transaction.date
        .toISOString()
        .split('T')[0];
      res.send(transaction);
    })
    .catch(error => {
      console.log(error);
    })
});

/**
 * DELETE list of transactions.
 */
router.delete('/', (req, res) => {
  let transactionIDs = req.body.transactionIDs;

  deleteTransactions(transactionIDs)
    .then(IDs => {
      res.send({ transactionIDs: IDs });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
