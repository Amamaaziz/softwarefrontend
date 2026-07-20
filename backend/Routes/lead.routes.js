const express = require('express');
const router = express.Router();
const { createLead } = require('../Controller/lead.controller');

router.post('/', createLead);

module.exports = router;