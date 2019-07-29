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

/**
 * Retrieves summary of transactions.
 *
 * @param {string} type - The type of summary to retrieve: 'expenses' or 'income'.
 * @param {string} tag - The category of transactions to retrieve.
 * @param {Date} start - The start date for the summary.
 * @param {Date} end - The end date for the summary.
 * @returns {Promise<Object>} - Summary statistics for the given time period.
 */
async function retrieveSummary(type, tag, start, end) {
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
    const tags = await retrieveTags();
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
 * @returns {Promise<Array>} - The user's distinct list of tags.
 */
async function retrieveTags() {
  return await db.collection(collectionName).distinct('tags');
}

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

module.exports = {
  addNewTransaction,
  deleteTransactions,
  retrieveSummary,
  retrieveTags,
  retrieveTransactions
};