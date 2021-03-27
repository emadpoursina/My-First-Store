const express = require('express');
const router = express.Router();
const v1 = require('./api-v1/index');
const v2 = require('./api-v2/index');

router.use('/v1/', v1);
router.use('/v2/', v2);

module.exports = router;