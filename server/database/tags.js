const database = require('./database');

const db = database.getDb();
const collectionName = 'transactionsCollection';

/**
 * Retrieves distinct list of tags from database.
 *
 * @returns {Promise<Array>} - The user's distinct list of tags.
 */
async function retrieveTags() {
  return await db.collection(collectionName).distinct('tags');
}

module.exports = { retrieveTags };