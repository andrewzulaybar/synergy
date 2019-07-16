const express = require('express');

const router = express.Router();

/**
 * GET home page.
 */
router.get('/', (req, res) => {
  res.send({ isConnected: true });
});

module.exports = router;
