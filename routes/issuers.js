/**
 * Imports
 */
const express = require('express');
const router = express();

// Issuer Model
const Issuer = require('../models/issuer');

// Issuer validator
const { validateIssuer: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all issuers
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const issuer = new Issuer({
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    src: req.body.src,
    src_small: req.body.src_small,
    url_link: req.body.url_link,
  });

  await issuer.save();
  res.send(issuer);
});

// Update an issuer
router.put('/:companyId', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const issuer = await Issuer.findByIdAndUpdate(req.params.companyId, {
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    src: req.body.src,
    src_small: req.body.src_small,
    url_link: req.body.url_link
  }, { new: true });
  if (!issuer) return res.status(404).send('The issuer with the given ID was not found');

  res.send(issuer);
});

// Delete an issuer
router.delete('/:companyId', async (req, res) => {
  const issuer = await Issuer.findByIdAndDelete(req.params.companyId);
  if (!issuer) return res.status(404).send('The issuer with the given ID was not found');

  res.send(issuer);
});

module.exports = router;