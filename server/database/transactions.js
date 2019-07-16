const database = require( './database' );

const db = database.getDb();
const collectionName = 'transactionsCollection';

/**
 * Retrieves list of transactions from database.
 *
 * @returns {Promise<Array>} - The user's list of transactions.
 */
async function retrieveTransactions() {
  let transactions = [];

  await db.collection(collectionName).aggregate(
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
              format: '%Y-%m-%d'
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

/**
 * Adds transaction to database and returns assigned id.
 *
 * @param {Object} transaction - The transaction to be added.
 * @returns {Promise<ObjectId>} - ObjectId of the newly created transaction.
 */
async function addNewTransaction(transaction) {
  const doc = await db.collection(collectionName).insertOne(transaction);
  return doc.insertedId;
}

module.exports = { retrieveTransactions, addNewTransaction };