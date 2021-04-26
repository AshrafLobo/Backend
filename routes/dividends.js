/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');
const router = express();

// Models
const Dividend = require('../models/dividend');
const Issuer = require('../models/issuer');

// Middleware
const auth = require('../middleware/auth');

// Dividend validator
const { validateDividend: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all dividends
router.get('/', async (req, res) => {
  let filter = {};

  if (req.query.issuerId) {
    filter["issuer"] = {
      _id: req.query.issuerId
    };
  }

  const dividends = await Dividend
    .find(filter)
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
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let dividend = new Dividend(_.pick(req.body, ['bookClosureDate', 'disbursmentDate', 'dividendType', 'dividendRate', 'status']))
  dividend.issuer = issuer._id;
  await dividend.save();

  let returnData = {...dividend["_doc"]};
  returnData.issuer = {
	_id: issuer._id,
	name: issuer.name
  };
  res.send(returnData);
});

// Update dividend
router.put('/:dividendId', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let dividend = _.pick(req.body, ['bookClosureDate', 'disbursmentDate', 'dividendType', 'dividendRate', 'status']);
  dividend.issuer = issuer._id;
  dividend = await Dividend.findByIdAndUpdate(req.params.dividendId, dividend, { new: true });
  if (!dividend) return res.status(404).send('The Dividend with the given ID was not found');

  let returnData = {...dividend["_doc"]};
  returnData.issuer = {
	_id: issuer._id,
	name: issuer.name
  };
  res.send(returnData);
});

// Delete dividend
router.delete('/:dividendId', auth, async (req, res) => {
  const dividend = await Dividend.findByIdAndDelete(req.params.dividendId);
  if (!dividend) return res.status(404).send('The Dividend with the given ID was not found');

  res.send(dividend);
});

module.exports = router;