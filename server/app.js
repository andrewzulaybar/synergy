const express = require('express');
const database = require('./database/database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

database.connectToServer((err) => {
  if (err)
      console.log(err);

  const indexRouter = require('./routes/index');
  const transactionsRouter = require('./routes/transactions');
  const accountsRouter = require('./routes/accounts');

  app.use('/api', indexRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/accounts', accountsRouter);
});

module.exports = app;
