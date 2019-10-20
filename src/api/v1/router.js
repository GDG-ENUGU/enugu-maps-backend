const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => res.send('OK'));

module.exports = router;
