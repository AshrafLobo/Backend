/**
 * Imports
 */
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const _ = require('lodash');
const dateFormat = require("dateformat");

const router = express();

// Models
const News = require('../models/news');
const Issuer = require('../models/issuer');

// Middleware
const auth = require('../middleware/auth');

/**
 * Functions
 */

// News validator
const { validateNews: validate } = require('../common/joiValidators');
const { getNewsArticle } = require('../common/functions');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./articles', (err) => {
      cb(null, 'articles')
    });
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
});

const upload = multer({ storage: storage });

const api_url = "http://13.244.154.208/api/"

/**
 * API Routes
 */

// Get all news articles
router.get('/', async (req, res) => {
  let filter = {};

  if (req.query.issuerId) {
    filter["issuer._id"] = req.query.issuerId
  }

  let articles = await News
    .find(filter)
    .lean()
    .sort('-original_postDate')
    .select();

  for (const article of articles) {
    const newsArticle = await getNewsArticle(article.article_src);
    article.newsArticle = newsArticle;

    const date = article._id.getTimestamp();
    article.date = date;
    article.dateCreated = dateFormat(date, "ddd, mmmm d, yyyy");

    if (article.original_postDate)
      article.original_postDate = dateFormat(article.original_postDate, "ddd, mmmm d, yyyy");

    article.timeCreated = dateFormat(date, "shortTime");
    article.issuer.src_small = api_url + article.issuer["src_small"].replace("\\", "\/");
  }

  res.send(articles);
});

// Get one news article
router.get('/:newsId', async (req, res) => {
  let article = await News.findById(req.params.newsId);
  if (!article) return res.status(404).send('The news article with the given ID was not found');

  const newsArticle = await getNewsArticle(article.article_src);
  article = article.toObject();
  article.newsArticle = newsArticle;
  article.issuer.src_small = api_url + article.issuer["src_small"].replace("\\", "\/");

  res.send(article);
});

// Add a new news article
router.post('/', [upload.single('article_src'), auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let article = _.pick(req.body, ['title', 'original_src', 'original_postDate']);
  article['article_src'] = req.file.path;
  article.issuer = _.pick(issuer, ['_id', 'name', 'title', 'src_small']);
  article = new News(article);
  await article.save();

  res.send(article);
});

// Update a news article
router.put('/:newsId', [upload.single('article_src'), auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if issuer exists
  const issuer = await Issuer.findById(req.body.issuerId);
  if (!issuer) return res.status(400).send("Invalid issuer.");

  let article = _.pick(req.body, ['title', 'original_src', 'original_postDate']);
  article['article_src'] = req.file.path;
  article.issuer = _.pick(issuer, ['_id', 'name', 'title', 'src_small']);
  article = await News.findByIdAndUpdate(req.params.newsId, article, { new: true });
  if (!article) return res.status(404).send('The news article with the given ID was not found');

  res.send(article);
});

// Delete a news article
router.delete('/:newsId', auth, async (req, res) => {
  const article = await News.findByIdAndDelete(req.params.newsId);
  if (!article) return res.status(404).send('The news article with the given ID was not found');

  res.send(`The news article was deleted successfully`);
});

module.exports = router;