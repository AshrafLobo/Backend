/**
 * Imports
 */
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express();

// Models
const User = require('../models/user');

// Middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// User validator
const { validateUser: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get user
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Get all users
router.get('/', auth, async (req, res) => {
  const users = await User.find().select('-password');
  res.send(users);
});

// Add a new user
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already exists.');

  user = new User(_.pick(req.body, ['_id', 'name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

// Update a user
router.put('/:userId', [auth, admin], async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, _.pick(req.body, ['name', 'email']), { new: true });
  if (!user) return res.status(404).send('The user with the given ID was not found');

  res.send(user);
});

// Delete a user
router.delete('/:userId', [auth, admin], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return res.status(404).send('The user with the given ID was not found');
  res.send(user);
});

module.exports = router;