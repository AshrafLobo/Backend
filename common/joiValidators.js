const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Issuer validator
function validateIssuer(issuer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().required(),
    src: Joi.string().min(5).max(50).required(),
    src_small: Joi.string().min(5).max(50).required(),
    url_link: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(issuer);
}

// News validator
function validateNews(news) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    article_src: Joi.string(),
    issuerId: Joi.objectId().required()
  });

  return schema.validate(news);
}

// Timeline validator
function validateTimeline(timeline) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(1024).required(),
    timelineDate: Joi.date().max('now').required()
  });

  return schema.validate(timeline);
}

// AGM validator
function validateAgm(agm) {
  const schema = Joi.object({
    issuerId: Joi.objectId().required(),
    title: Joi.string().min(5).max(255).required(),
    agmDate: Joi.date(),
    venue: Joi.string().min(5).max(255),
    status: Joi.string().valid('pending', 'completed')
  });

  return schema.validate(agm);
}

// EGM validator
function validateEgm(egm) {
  const schema = Joi.object({
    issuerId: Joi.objectId().required(),
    title: Joi.string().min(5).max(255).required(),
    egmDate: Joi.date(),
    venue: Joi.string().min(5).max(255),
    status: Joi.string().valid('pending', 'completed')
  });

  return schema.validate(egm);
}

// Dividend validator
function validateDividend(dividend) {
  const schema = Joi.object({
    issuerId: Joi.objectId().required(),
    bookClosureDate: Joi.date(),
    disbursmentDate: Joi.date(),
    dividendType: Joi.string().min(2).max(50),
    dividendRate: Joi.boolean(),
    status: Joi.string().valid('pending', 'completed')
  });

  return schema.validate(dividend);
}

// Exports
exports.validateIssuer = validateIssuer;
exports.validateNews = validateNews;
exports.validateTimeline = validateTimeline;
exports.validateAgm = validateAgm;
exports.validateEgm = validateEgm;
exports.validateDividend = validateDividend;