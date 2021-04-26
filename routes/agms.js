/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');
const router = express();

// Models
const Agm = require('../models/agm');
const Issuer = require('../models/issuer');

// Middleware
const auth = require('../middleware/auth');

// Agm validator
const { validateAgm: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all agms
router.get('/', async (req, res) => {
  let filter = {};

  if (req.query.issuerId) {
    filter["issuer"] = {
      _id: req.query.issuerId
    };
  }

  const agms = await Agm
    .find(filter)
    .populate('issuer', 'name');

  res.send(agms);
});

// Get one agm
router.get('/:agmId', async (req, res) => {
  const agm = await Agm
    .findById(req.params.agmId)
    .populate('issuer', 'name');

  if (!agm) return res.status(404).send('The AGM with the given ID was not found');
  res.send(agm);
});

// Add a new agm
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let agm = new Agm(_.pick(req.body, ['title', 'agmDate', 'venue', 'status']))
  agm.issuer = issuer._id;
  await agm.save();

  let returnData = {...agm["_doc"]};
  returnData.issuer = {
	_id: issuer._id,
	name: issuer.name
  };
  res.send(returnData);
});

// Update an agm
router.put('/:agmId', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let agm = _.pick(req.body, ['title', 'agmDate', 'venue', 'status']);
  agm.issuer = issuer._id;
  agm = await Agm.findByIdAndUpdate(req.params.agmId, agm, { new: true });
  if (!agm) return res.status(404).send('The AGM with the given ID was not found');

  let returnData = {...agm["_doc"]};
  returnData.issuer = {
	_id: issuer._id,
	name: issuer.name
  };
  res.send(returnData);
});

// Delete an agm
router.delete('/:agmId', auth, async (req, res) => {
  const agm = await Agm.findByIdAndDelete(req.params.agmId);
  if (!agm) return res.status(404).send('The AGM with the given ID was not found');

  res.send(agm);
});

module.exports = router;