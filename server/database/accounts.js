ObjectId = require('mongodb').ObjectID;

const database = require( './database' );

const db = database.getDb();
const collectionName = 'usersItems';

/**
 * Adds item credentials to user's list of items.
 *
 * @param {number} userID - The ID of the user to add the item to.
 * @param {string} itemID - The item identifier.
 * @param {string} accessToken - The access token for the item.
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

/**
 * Retrieves all items associated with the given user ID.
 *
 * @param {number} userID - The ID of the user to search items for.
 * @returns {Promise<Array>} - An array containing objects with the item ID and access token.
 */
async function getItems(userID) {
  const items = await db.collection(collectionName).aggregate(
    [
      {
        $match: { userID : userID }
      },
      {
        $project: {
          _id: 0,
          items: 1
        }
      }
    ]
  ).toArray();
  return items[0].items;
}

module.exports = {
  addItem,
  getItems,
};