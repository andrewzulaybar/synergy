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
  return await db.collection(collectionName).aggregate(
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
  ).toArray();
}

/**
 * If start or end is null, then retrieves summary for all transactions.
 * Otherwise, retrieves summary for transactions between start and end date inclusive.
 *
 * @param {string} type - The type of summary to retrieve: 'expenses' or 'income'.
 * @param {Date} start - The start date for the summary.
 * @param {Date} end - The end date for the summary.
 * @returns {Promise<Object>} - Summary statistics for the given time period.
 */
async function retrieveSummary(type, start, end) {
  let summary = [];
  // if all are null, request was sent to /summary
  if (type === null && start === null && end === null) {
    summary = await db.collection(collectionName).aggregate(
      [
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            sum: { $sum: { $convert: { input: '$amount', to: 'double' } } },
          }
        }
      ]
    ).toArray();
  }
  // if request was sent with query params to /summary?type={type}&start={start}&end={end}
  else if (type && start && end && start <= end) {
    let amount;
    if (type === 'expenses') amount = { $lt: '0' };
    else if (type === 'income') amount = { $gt: '0' };
    summary = await db.collection(collectionName).aggregate(
      [
        {
          $match: {
            amount: amount,
            date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            sum: { $sum: { $convert: { input: '$amount', to: 'double' } } },
          }
        }
      ]
    ).toArray();
  }
  return (summary.length !== 0)
    ? summary[0]
    : { _id: null, sum: 0 };
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
  retrieveSummary,
  retrieveTransactions
};