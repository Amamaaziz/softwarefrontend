const express = require('express');
const router = express.Router();
const { createLead } = require('../controller/lead.controller');

router.post('/', createLead);

module.exports = router;