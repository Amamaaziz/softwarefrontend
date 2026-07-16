// backend/Routes/admin.leads.js  (protected)
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth.middleware');
const { listLeads, getLead, updateLead, deleteLead } = require('../controller/lead.controller');

router.use(isAdmin);
router.get('/', listLeads);
router.get('/:id', getLead);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;