const express = require('express');
const database = require('./database/database');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

database.connectToServer((err) => {
  if (err)
      console.log(err);

  const indexRouter = require('./routes');
  const transactionsRouter = require('./routes/transactions');
  const accountsRouter = require('./routes/accounts');

  app.use('/api', indexRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/accounts', accountsRouter);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('client', 'build', 'index.html'));
    });
  }
});

module.exports = app;
