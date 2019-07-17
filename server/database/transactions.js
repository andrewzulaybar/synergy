ObjectId = require('mongodb').ObjectID;

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
 * Adds transaction to database and returns the assigned ID.
 *
 * @param {Object} transaction - The transaction to be added.
 * @returns {Promise<ObjectId>} - ObjectId of the newly created transaction.
 */
async function addNewTransaction(transaction) {
  const doc = await db.collection(collectionName).insertOne(transaction);
  return doc.insertedId;
}

/**
 * Deletes transactions from database and returns the deleted transaction IDs.
 *
 * @param {Array<String>} transactionIDs - The list of transaction IDs to be deleted.
 * @returns {Promise<Array<String>>} - List of transaction IDs deleted.
 */
async function deleteTransactions(transactionIDs) {
  let i, transactionsToDelete = [];
  for (i = 0; i < transactionIDs.length; i++) {
    transactionsToDelete.push(new ObjectId(transactionIDs[i]));
  }
  await db.collection(collectionName).deleteMany(
    {
      _id: {
        $in: transactionsToDelete
      }
    }
  );
  return transactionIDs;
}

module.exports = {
  addNewTransaction,
  deleteTransactions,
  retrieveTransactions
};