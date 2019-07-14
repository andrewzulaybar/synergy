const express = require('express');
const router = express.Router();

let transactions = [
    {
        id: 1,
        amount: '-20',
        description: 'H&M',
        method: 'Cash',
        tags: ['clothes'],
        date: 'Jan 20, 2019'
    },
    {
        id: 2,
        amount: '200',
        description: 'Work',
        method: 'Debit',
        tags: ['income'],
        date: 'Mar 29, 2019'
    },
    {
        id: 3,
        amount: '-50',
        description: 'Food',
        method: 'Mastercard',
        tags: ['restaurants'],
        date: 'Apr 20, 2019'
    },
    {
        id: 4,
        amount: '-8',
        description: 'Origins',
        method: 'Cash',
        tags: ['skincare', 'travel'],
        date: 'Dec 17, 2018'
    },
];

/* GET list of transactions */
router.get('/', function (req, res) {
    res.send({ transactions: transactions });
});

/* POST new transaction */
router.post('/', function (req, res) {
    const transaction = {
        id: req.body.id,
        amount: req.body.amount,
        description: req.body.description,
        method: req.body.method,
        tags: req.body.tags,
        date: req.body.date,
    };
    transactions.push(transaction);
    res.send(transaction);
});

module.exports = router;
