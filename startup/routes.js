// Npm imports
const express = require('express');
const cors = require('cors');

// Route imports
const issuers = require('../routes/issuers');
const news = require('../routes/news');
const timelines = require('../routes/timelines');
const agms = require('../routes/agms');
const egms = require('../routes/egms');
const dividends = require('../routes/dividends');
const users = require('../routes/users');
const auth = require('../routes/auth');

// Forms imports
const payroll_forms = require('../routes/payroll-forms');
const payroll_download_forms = require('../routes/payroll-download-forms');
const contact_us_forms = require('../routes/contact-us-forms');
const share_registration_forms = require('../routes/share-registration-forms');

// Middleware imports
const error = require('../middleware/error');

module.exports = function (app) {
  /** Middleware - Before Route Call */
  app.use(express.json());
  app.use(cors());
  app.use('/uploads', express.static('uploads'))
  app.use('/articles', express.static('articles'))

  /** API Routes Mapping */
  app.use('/issuers', issuers);
  app.use('/news', news);
  app.use('/timelines', timelines);
  app.use('/agms', agms);
  app.use('/egms', egms);
  app.use('/dividends', dividends);
  app.use('/users', users);
  app.use('/auth', auth);

  /** Forms API Routes Mapping */
  app.use('/payroll-forms', payroll_forms);
  app.use('/payroll-downloads-forms', payroll_download_forms);
  app.use('/contact-us', contact_us_forms);
  app.use('/share-registration-forms', share_registration_forms);

  /** Middleware - After Route Call */
  app.use(error)
}
