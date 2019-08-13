ObjectId = require('mongodb').ObjectID;

const database = require( './database' );

const db = database.getDb();
const collectionName = 'transactionsCollection';

/**
 * Adds transaction to database and returns the assigned ID.
 *
 * @param {Object} transaction - The transaction to be added.
 * @returns {Promise<ObjectId>} - ObjectId of the newly created transaction.
 */
async function addTransaction(transaction) {
  const doc = await db.collection(collectionName).insertOne(transaction);
  return doc.insertedId;
}

/**
 * Deletes transactions from database and returns the deleted transaction IDs.
 *
 * @param {string[]} transactionIDs - The list of transaction IDs to be deleted.
 * @returns {Promise<string[]>} - The list of transaction IDs deleted.
 */
async function deleteTransactions(transactionIDs) {
  let transactionsToDelete = [];
  for (let i = 0; i < transactionIDs.length; i++)
    transactionsToDelete.push(new ObjectId(transactionIDs[i]));
  await db.collection(collectionName).deleteMany(
    {
      _id: {
        $in: transactionsToDelete
      }
    }
  );
  return transactionIDs;
}

/**
 * Retrieves list of transactions from database, sorted in reverse chronological order.
 *
 * @returns {Promise<Object[]>} - The user's list of transactions.
 */
async function getTransactions() {
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
  ).sort({ date: -1 }).toArray();
}

/**
 * Retrieves summary of transactions.
 *
 * @param {string} type - The type of summary to retrieve: 'expenses' or 'income'.
 * @param {string} tag - The category of transactions to retrieve.
 * @param {Date} start - The start date for the summary.
 * @param {Date} end - The end date for the summary.
 * @returns {Promise<Object>} - Summary statistics for the given time period.
 */
async function getSummary(type, tag, start, end) {
  let summary;

  const match = {
    $match: {}
  };

  const group = {
    $group: {
      _id: null,
      count: {$sum: 1},
      sum: {
        $sum: {
          $convert: {
            input: '$amount', to: 'double'
          }
        }
      }
    }
  };

  const project = {
    $project: {
      sum: {
        $divide: [{
          $trunc: {
            $multiply: ["$sum", 100]
          }
        }, 100]
      }
    }
  };

  if (type) {
    let amount;
    if (type === 'expenses')
      amount = {$lt: '0'};
    else if (type === 'income')
      amount = {$gt: '0'};
    match['$match']['amount'] = amount;
  }

  if (tag)
    match['$match']['tags'] = {$in: [tag.toLowerCase(), '$tags']};

  if (start || end) {
    let date = {};
    if (start)
      date = {$gte: start};
    if (end)
      date = {...date, $lte: end};
    match['$match']['date'] = date;
  }

  const response = await db.collection(collectionName).aggregate([match, group, project]).toArray();
  summary = response.length === 0
    ? { _id: null, sum: 0 }
    : response[0];

  if (type)
    summary['type'] = type;
  else
    summary['type'] = 'all';

  if (tag) {
    const tags = await getTags();
    if (tags.includes(tag))
      summary['tag'] = tag;
    else
      summary = {...summary, tag: tag};
  }

  return summary;
}

/**
 * Retrieves distinct list of tags from database.
 *
 * @returns {Promise<[]>} - The user's distinct list of tags.
 */
async function getTags() {
  return await db.collection(collectionName).distinct('tags');
}

module.exports = {
  addTransaction,
  deleteTransactions,
  getTransactions,
  getSummary,
  getTags,
};