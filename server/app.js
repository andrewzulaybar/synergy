const express = require('express');

const indexRouter = require('./routes/index');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', indexRouter);
app.use('/api/transactions', transactionsRouter);

module.exports = app;
