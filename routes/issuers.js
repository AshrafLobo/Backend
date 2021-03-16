/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');
const router = express();

// Issuer Model
const Issuer = require('../models/issuer');

// Middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Issuer validator
const { validateIssuer: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all issuers
router.get('/', async (req, res, next) => {
  const issuers = await Issuer.find().sort('name');
  res.send(issuers);
});

// Get one issuer
router.get('/:companyId', async (req, res) => {
  const issuer = await Issuer.findById(req.params.companyId);

  if (!issuer) return res.status(404).send('The issuer with the given ID was not found');
  res.send(issuer);
});

// Add a new issuer
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const issuer = new Issuer(_.pick(req.body, ['name', 'title', 'description', 'src', 'src_small', 'url_link']))
  await issuer.save();

  res.send(issuer);
});

// Update an issuer
router.put('/:companyId', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const issuer = await Issuer.findByIdAndUpdate(req.params.companyId, _.pick(req.body, ['name', 'title', 'description', 'src', 'src_small', 'url_link']), { new: true });
  if (!issuer) return res.status(404).send('The issuer with the given ID was not found');

  res.send(issuer);
});

// Delete an issuer
router.delete('/:companyId', [auth, admin], async (req, res) => {
  const issuer = await Issuer.findByIdAndDelete(req.params.companyId);
  if (!issuer) return res.status(404).send('The issuer with the given ID was not found');

  res.send(issuer);
});

module.exports = router;