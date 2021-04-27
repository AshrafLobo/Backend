/**
 * Imports
 */
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const _ = require('lodash');
const router = express();

// Issuer Model
const Issuer = require('../models/issuer');

// Middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Issuer validator
const { validateIssuer: validate } = require('../common/joiValidators');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./uploads/', (err) => {
      cb(null, 'uploads');
    });
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });
const logoUpload = upload.fields([{ name: 'src' }, { name: 'src_small' }]);

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
router.post('/', [logoUpload, auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let data = _.pick(req.body, ['name', 'title', 'description']);
  data['url_link'] = data.name.toLowerCase().replace(' ', "_");

  if (req.files) {
    let { src, src_small } = req.files;
    [src] = src;
    [src_small] = src_small;

    data[src] = src.path;
    data[src_small] = src_small.path;
    // data['src'] = `${req.protocol}://${req.headers.host}/${src.path.replace("\\", "\/")}`;
    // data['src_small'] = `${req.protocol}://${req.headers.host}/${src_small.path.replace("\\", "\/")}`;
  }

  const issuer = new Issuer(data)
  await issuer.save();

  res.send(issuer);
});

// Update an issuer
router.put('/:companyId', [logoUpload, auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let data = _.pick(req.body, ['name', 'title', 'description']);
  data['url_link'] = data.name.toLowerCase().replace(' ', "_");

  if (req.files) {
    let { src, src_small } = req.files;
    [src] = src;
    [src_small] = src_small;

    data[src] = src.path;
    data[src_small] = src_small.path;
    // data['src'] = `${req.protocol}://${req.headers.host}/${src.path.replace("\\", "\/")}`;
    // data['src_small'] = `${req.protocol}://${req.headers.host}/${src_small.path.replace("\\", "\/")}`;
  }

  const issuer = await Issuer.findByIdAndUpdate(req.params.companyId, data, { new: true });
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