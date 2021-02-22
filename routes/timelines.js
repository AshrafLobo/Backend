/**
 * Imports
 */
const express = require('express');
const router = express();

// Timeline Model
const Timeline = require('../models/timeline');

// Timeline validator
const { validateTimeline: validate } = require('../common/joiValidators');

/**
 * API Routes
 */

// Get all timelines
router.get('/', async (req, res) => {
  const issuers = await Timeline.find().sort('name');
  res.send(issuers);
});

// Get one timeline
// router.get('/:timelineId', async (req, res) => {
//   const timeline = await Timeline.findById(req.params.timelineId);

//   if (!timeline) return res.status(404).send('The timeline with the given ID was not found');
//   res.send(timeline);
// });

// Add a new timeline
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = new Timeline({
    title: req.body.title,
    description: req.body.description,
    timelineDate: req.body.timelineDate
  });

  await timeline.save();
  res.send(timeline);
});

// Update a timeline
router.put('/:testimonialId', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = await Timeline.findByIdAndUpdate(req.params.testimonialId, {
    title: req.body.title,
    description: req.body.description,
    timelineDate: req.body.timelineDate
  }, { new: true });
  if (!timeline) return res.status(404).send('The timeline with the given ID was not found');

  res.send(timeline);
});

// Delete a timeline
router.delete('/:testimonialId', async (req, res) => {
  const testimonial = await Timeline.findByIdAndDelete(req.params.testimonialId);
  if (!testimonial) return res.status(404).send('The testimonial with the given ID was not found');

  res.send(testimonial);
});

module.exports = router;