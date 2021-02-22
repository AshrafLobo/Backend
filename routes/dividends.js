/**
 * Imports
 */
const express = require('express');
const router = express();

// Models
const Dividend = require('../models/dividend');
const Issuer = require('../models/issuer');

// Dividend validator
const { validateDividend: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all dividends
router.get('/', async (req, res) => {
  const dividends = await Dividend
    .find()
    .populate('issuer', 'name');

  res.send(dividends);
});

// Get one dividend
router.get('/:dividendId', async (req, res) => {
  const dividend = await Dividend
    .findById(req.params.dividendId)
    .populate('issuer', 'name');

  if (!dividend) return res.status(404).send('The Dividend with the given ID was not found');
  res.send(dividend);
});

// Add new dividend
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const dividend = new Dividend({
    issuer: issuer._id,
    bookClosureDate: req.body.bookClosureDate,
    disbursmentDate: req.body.disbursmentDate,
    dividendType: req.body.dividendType,
    dividendRate: req.body.dividendRate,
    status: req.body.status,
    dateUpdated: req.body.dateUpdated
  });

  await dividend.save();
  res.send(dividend);
});

// Update dividend
router.put('/:dividendId', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const dividend = await Dividend.findByIdAndUpdate(req.params.dividendId, {
    issuer: issuer._id,
    bookClosureDate: req.body.bookClosureDate,
    disbursmentDate: req.body.disbursmentDate,
    dividendType: req.body.dividendType,
    dividendRate: req.body.dividendRate,
    status: req.body.status,
    dateUpdated: req.body.dateUpdated
  }, { new: true });
  if (!dividend) return res.status(404).send('The Dividend with the given ID was not found');

  res.send(dividend);
});

// Delete dividend
router.delete('/:dividendId', async (req, res) => {
  const dividend = await Dividend.findByIdAndDelete(req.params.dividendId);
  if (!dividend) return res.status(404).send('The Dividend with the given ID was not found');

  res.send(dividend);
});

module.exports = router;