const express = require('express');
const database = require('./database/database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

database.connectToServer((err) => {
  if (err)
      console.log(err);

  const indexRouter = require('./routes/index');
  const tagsRouter = require('./routes/tags');
  const transactionsRouter = require('./routes/transactions');

  app.use('/api', indexRouter);
  app.use('/api/tags', tagsRouter);
  app.use('/api/transactions', transactionsRouter);
});

module.exports = app;
