/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');

const router = express();

// Models
const ShareRegistrationForm = require('../models/share-registration-form');

// Middleware
const auth = require('../middleware/auth');

// Functions
const { validateShareRegistrationForm: validate } = require('../common/joiValidators');
const sendEmail = require('../common/sendEmail');

/**
 * API Routes
 */

// Add a new share registration form
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, idNumber, cdscNumber, company, service, message } = req.body;
  const output = `
  <p>SHARE REGISTRATION FORM REQUEST</p>
  <h3>User Details</h3>
  <ol>
    <li>Name: ${firstName} ${lastName}</li>    
    <li>Email: ${email}</li>    
    <li>Phone number: ${phoneNumber}</li>    
    <li>Address: ${address || "N/A"}</li>    
    <li>ID Number: ${idNumber}</li>    
    <li>CDSC Number: ${cdscNumber || "N/A"}</li>    
  </ol> 

  <h3>SERVICE: ${service}</h3>
  <p><strong>Company associated with service:</strong> ${company}</p>

  <h3>Message</h3>
  <p>${message}</p>
`;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const formData = new ShareRegistrationForm(_.pick(req.body, ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'idNumber', 'cdscNumber', 'company', 'service', 'message']));
  await formData.save();
  sendEmail(output, "Share registration form request");
  res.send(formData);
});

// Delete a share registration form
router.delete('/:formId', auth, async (req, res) => {
  const form = await ShareRegistrationForm.findByIdAndDelete(req.params.formId);
  if (!form) return res.status(404).send('The form with the given ID was not found');

  res.send(form);
});

module.exports = router;