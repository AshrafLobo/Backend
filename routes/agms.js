/**
 * Imports
 */
const express = require('express');
const router = express();

// Models
const Agm = require('../models/agm');
const Issuer = require('../models/issuer');

// Agm validator
const { validateAgm: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all agms
router.get('/', async (req, res) => {
  const agms = await Agm
    .find()
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
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const agm = new Agm({
    issuer: issuer._id,
    title: req.body.title,
    agmDate: req.body.agmDate,
    venue: req.body.venue,
    status: req.body.status
  });

  await agm.save();
  res.send(agm);
});

// Update an agm
router.put('/:agmId', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const agm = await Agm.findByIdAndUpdate(req.params.agmId, {
    issuer: issuer._id,
    title: req.body.title,
    agmDate: req.body.agmDate,
    venue: req.body.venue,
    status: req.body.status
  }, { new: true });
  if (!agm) return res.status(404).send('The AGM with the given ID was not found');

  res.send(agm);
});

// Delete an agm
router.delete('/:agmId', async (req, res) => {
  const agm = await Agm.findByIdAndDelete(req.params.agmId);
  if (!agm) return res.status(404).send('The AGM with the given ID was not found');

  res.send(agm);
});

module.exports = router;