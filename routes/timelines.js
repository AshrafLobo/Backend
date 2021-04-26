/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');

const router = express();

// Timeline Model
const Timeline = require('../models/timeline');

// Middleware
const auth = require('../middleware/auth');

// Timeline validator
const { validateTimeline: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all timelines
router.get('/', async (req, res) => {
  const timeline = await Timeline.find().sort('timelineDate');
  res.send(timeline);
});

// Get one timeline
router.get('/:timelineId', async (req, res) => {
  const timeline = await Timeline.findById(req.params.timelineId);

  if (!timeline) return res.status(404).send('The timeline with the given ID was not found');
  res.send(timeline);
});

// Add a new timeline
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = new Timeline(_.pick(req.body, ['title', 'description', 'timelineDate']));
  await timeline.save();

  res.send(timeline);
});

// Update a timeline
router.put('/:timelineId', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = await Timeline.findByIdAndUpdate(req.params.timelineId, _.pick(req.body, ['title', 'description', 'timelineDate']), { new: true })
  if (!timeline) return res.status(404).send('The timeline with the given ID was not found');

  res.send(timeline);
});

// Delete a timeline
router.delete('/:timelineId', auth, async (req, res) => {
  const timeline = await Timeline.findByIdAndDelete(req.params.timelineId);
  if (!timeline) return res.status(404).send('The timeline with the given ID was not found');

  res.send(timeline);
});

module.exports = router;