/**
 * Imports
 */
const express = require('express');
const router = express();

// Models
const News = require('../models/news');
const Issuer = require('../models/issuer');

// Functions
const { validateNews: validate } = require('../common/joiValidators');
const { getNewsArticle } = require('../common/functions');

/**
 * API Routes
 */

// Get all news articles
router.get('/', async (req, res) => {
  let articles = await News
    .find()
    .lean()
    .sort('-_id')
    .select();

  var articles1 = [];
  articles.forEach(async article => {
    article.newsArticle = await getNewsArticle(article.article_src);
    articles1.push(article);
    //console.log(article);
  })

  console.log(articles1);
  res.send(articles1);
});

// Get one news article
router.get('/:newsId', async (req, res) => {
  let article = await News.findById(req.params.newsId);

  const newsArticle = await getNewsArticle(article.article_src);
  article = article.toObject();
  article.newsArticle = newsArticle;

  if (!article) return res.status(404).send('The news article with the given ID was not found');
  res.send(article);
});

// Add a new news article
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const article = new News({
    title: req.body.title,
    issuer: {
      _id: issuer._id,
      name: issuer.name,
      src_small: issuer.src_small
    },
    article_src: req.body.article_src
  });

  await article.save();
  res.send(article);
});

// Update a news article
router.put('/:newsId', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  const article = await News.findByIdAndUpdate(req.params.newsId, {
    title: req.body.title,
    issuer: {
      _id: issuer._id,
      name: issuer.name,
      src_small: issuer.src_small
    },
    article_src: req.body.article_src,
    dateUpdated: Date.now()
  }, { new: true });
  if (!article) return res.status(404).send('The news article with the given ID was not found');

  res.send(article);
});

// Delete a news article
router.delete('/:newsId', async (req, res) => {
  const article = await News.findByIdAndDelete(req.params.newsId);
  if (!article) return res.status(404).send('The news article with the given ID was not found');

  res.send();
});

module.exports = router;