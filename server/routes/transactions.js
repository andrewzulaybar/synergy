const express = require('express');

const { checkErrors, summaryValidator } = require('../validators/summary');
const {
  addTransaction,
  deleteTransactions,
  getTransactions,
  getSummary,
  getTags,
} = require('../database/transactions');

const router = express.Router();

/**
 * GET list of transactions.
 */
router.get('/', (req, res) => {
  getTransactions()
    .then(transactions =>
      res.send({ transactions: transactions })
    )
    .catch(error => {
      res.send({ transactions: [] });
      console.log(error);
    });
});

/**
 * POST a new transaction.
 */
router.post('/', (req, res) => {
  const transaction = {
    amount: req.body.amount,
    description: req.body.description,
    method: req.body.method,
    tags: req.body.tags || [],
    date: new Date(req.body.date),
  };
  addTransaction(transaction)
    .then(objectId => {
      transaction._id = objectId;
      transaction.date = transaction.date
        .toISOString()
        .split('T')[0];
      res.send({ transaction: transaction });
    })
    .catch(error => {
      res.send({ transaction: {} });
      console.log(error);
    });
});

/**
 * DELETE list of transactions.
 */
router.delete('/', (req, res) => {
  const transactionIDs = req.body.transactionIDs;
  deleteTransactions(transactionIDs)
    .then(IDs =>
      res.send({ transactionIDs: IDs })
    )
    .catch(error => {
      res.send({ transactionIDs: [] });
      console.log(error);
    });
});

/**
 * GET summary statistics.
 */
router.get('/summary', summaryValidator, (req, res) => {
  checkErrors(req, res);
  const type = req.query.type || null;
  const tag = req.query.tag || null;
  const start = req.query.start ? new Date(req.query.start) : null;
  const end = req.query.end ? new Date(req.query.end) : null;
  getSummary(type, tag, start, end)
    .then(summary =>
      res.send({ summary: summary })
    )
    .catch(error => {
      res.send({ summary: {} });
      console.log(error);
    });
});

/**
 * GET list of distinct tags.
 */
router.get('/tags', (req, res) => {
  getTags()
    .then(tags =>
      res.send({ tags: tags })
    )
    .catch(error => {
      res.send({ tags: [] });
      console.log(error);
    });
});

module.exports = router;
