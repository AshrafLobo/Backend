/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');
const router = express();

// Models
const Egm = require('../models/egm');
const Issuer = require('../models/issuer');

// Middleware
const auth = require('../middleware/auth');

// Egm validator
const { validateEgm: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all egms
router.get('/', async (req, res) => {
  let filter = {};

  if (req.query.issuerId) {
    filter["issuer"] = {
      _id: req.query.issuerId
    };
  }

  const egms = await Egm
    .find(filter)
    .populate('issuer', 'name');

  res.send(egms);
});

// Get one egm
router.get('/:egmId', async (req, res) => {
  const egm = await Egm
    .findById(req.params.egmId)
    .populate('issuer', 'name');

  if (!egm) return res.status(404).send('The EGM with the given ID was not found');
  res.send(egm);
});

// Add a new egm
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let egm = new Egm(_.pick(req.body, ['title', 'egmDate', 'venue', 'status']))
  egm.issuer = issuer._id;
  await egm.save();

  res.send(egm);
});

// Update an egm
router.put('/:egmId', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let egm = _.pick(req.body, ['title', 'agmDate', 'venue', 'status']);
  egm.issuer = issuer._id;
  egm = await Egm.findByIdAndUpdate(req.params.egmId, egm, { new: true });
  if (!egm) return res.status(404).send('The EGM with the given ID was not found');

  res.send(egm);
});

// Delete an egm
router.delete('/:egmId', auth, async (req, res) => {
  const egm = await Egm.findByIdAndDelete(req.params.egmId);
  if (!egm) return res.status(404).send('The EGM with the given ID was not found');

  res.send(egm);
});

module.exports = router;