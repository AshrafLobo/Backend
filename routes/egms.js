/**
 * Imports
 */
const express = require('express');
const router = express();

// Models
const Egm = require('../models/egm');
const Issuer = require('../models/issuer');

// Agm validator
const { validateEgm: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all egms
router.get('/', async (req, res) => {
  const egms = await Egm
    .find()
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
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const egm = new Egm({
    issuer: issuer._id,
    title: req.body.title,
    egmDate: req.body.egmDate,
    venue: req.body.venue,
    status: req.body.status
  });

  await egm.save();
  res.send(egm);
});

// Update an egm
router.put('/:egmId', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const egm = await Egm.findByIdAndUpdate(req.params.egmId, {
    issuer: issuer._id,
    title: req.body.title,
    egmDate: req.body.egmDate,
    venue: req.body.venue,
    status: req.body.status
  }, { new: true });
  if (!egm) return res.status(404).send('The EGM with the given ID was not found');

  res.send(egm);
});

// Delete an egm
router.delete('/:egmId', async (req, res) => {
  const egm = await Egm.findByIdAndDelete(req.params.egmId);
  if (!egm) return res.status(404).send('The EGM with the given ID was not found');

  res.send(egm);
});

module.exports = router;