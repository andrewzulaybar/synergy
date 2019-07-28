const express = require('express');

const { retrieveTags } = require('../database/tags');

const router = express.Router();

/**
 * GET list of distinct tags.
 */
router.get('/', (req, res) => {
  retrieveTags()
    .then(tags => {
      res.send({ tags: tags });
    })
    .catch(error => {
      res.send({ tags: [] });
      console.log(error);
    });
});

module.exports = router;