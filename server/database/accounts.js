ObjectId = require('mongodb').ObjectID;

const database = require( './database' );

const db = database.getDb();
const collectionName = 'usersItems';

/**
 * Adds item credentials to user's list of items.
 *
 * @param userID - The ID of the user to add the item to.
 * @param itemID - The item identifier.
 * @param accessToken - The access token for the item.
 * @returns {Promise<Object>} - An object containing the item ID and access token.
 */
async function addItem(userID, itemID, accessToken) {
  const newItem = {
    itemID: itemID,
    accessToken: accessToken,
  };
  const user = await db.collection(collectionName).findOne({ userID: userID });
  if (user != null) {
    await db.collection(collectionName).updateOne(
      { userID: userID },
      { $push:
        { items: newItem }
      }
    )
  } else {
    await db.collection(collectionName).insertOne({
      userID: userID,
      items: [
        { ...newItem }
      ]
    })
  }
  return newItem;
}

module.exports = {
  addItem
};