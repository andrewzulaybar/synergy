const database = require( './database' );

/**
 * Retrieves list of transactions from database.
 *
 * @returns {Promise<Array>} - The user's list of transactions.
 */
async function retrieveTransactions() {
  let transactions = [];
  const db = database.getDb();

  await db.collection("transactionsCollection").aggregate(
    [
      {
        $project: {
          _id: 1,
          amount: 1,
          description: 1,
          method: 1,
          tags: 1,
          date: {
            $dateToString: {
              date: '$date',
              format: '%m-%d-%Y'
            }
          }
        }
      }
    ]
  ).forEach((transaction) => {
    transactions.push(transaction);
  });

  return transactions;
}

module.exports = retrieveTransactions;