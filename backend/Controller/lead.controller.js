// backend/controllers/leadController.js
const { PrismaClient } = require('@prisma/client');
const { toLeadCategoryEnum } = require('../utils/leadCategoryMap');
const prisma = new PrismaClient();

// PUBLIC — contact form submit
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, category, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'name, email and message are required' });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        category: toLeadCategoryEnum(category),
        message,
      },
    });

    return res.status(201).json({ success: true, data: lead });
  } catch (err) {
    console.error('createLead error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit contact form' });
  }
};

// ADMIN — list all leads
exports.listLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: leads });
  } catch (err) {
    console.error('listLeads error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

// ADMIN — get one
exports.getLead = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.json({ success: true, data: lead });
  } catch (err) {
    console.error('getLead error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch lead' });
  }
};

// ADMIN — update status
exports.updateLead = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json({ success: true, data: lead });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Lead not found' });
    console.error('updateLead error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
};

// ADMIN — delete
exports.deleteLead = async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Lead not found' });
    console.error('deleteLead error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
};