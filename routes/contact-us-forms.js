/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');

const router = express();

// Models
const ContactUsForm = require('../models/contact-us-form');

// Middleware
const auth = require('../middleware/auth');

// Functions
const { validateContactUsForm: validate } = require('../common/joiValidators');
const sendEmail = require('../common/sendEmail');

/**
 * API Routes
 */

// Add a new payroll form
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, subject, message } = req.body;
  const output = `
  <p>CONTACT US FORM REQUEST</p>
  <h3>User Details</h3>
  <ol>
    <li>Name: ${firstName} ${lastName}</li>    
    <li>Email: ${email}</li>    
    <li>Phone number: ${phoneNumber}</li>    
  </ol> 
  
  <h3>Subject: ${subject}</h3>
  <h3>Message</h3>
  <p>${message}</p>
`;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const formData = new ContactUsForm(_.pick(req.body, ['firstName', 'lastName', 'email', 'phoneNumber', 'subject', 'message']));
  await formData.save();
  sendEmail(output, "Contact us form request");
  res.send(formData);
});

// Delete a payroll form
router.delete('/:formId', auth, async (req, res) => {
  const form = await ContactUsForm.findByIdAndDelete(req.params.formId);
  if (!form) return res.status(404).send('The form with the given ID was not found');

  res.send(form);
});

module.exports = router;