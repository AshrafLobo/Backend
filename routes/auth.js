/**
 * Imports
 */
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const router = express();

// Models
const User = require('../models/user');

/**
 * API Routes
 */

// Add new auth
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  // Compare passwords
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
  });

  return schema.validate(req);
}

module.exports = router;