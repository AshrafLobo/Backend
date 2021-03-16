/**
 * Imports
 */
const express = require('express');
const _ = require('lodash');

const router = express();

// Models
const PayrollDownloadForm = require('../models/payroll-download-form');

// Middleware
const auth = require('../middleware/auth');

// Functions
const { validateDownloadPayrollForm: validate } = require('../common/joiValidators');
const sendEmail = require('../common/sendEmail');

/**
 * API Routes
 */

// Add a new payroll form
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, subject, message } = req.body;
  const output = `
  <p>PAYROLL DOWNLOAD FORM REQUEST</p>
  <h3>User Details</h3>
  <ol>
    <li>Name: ${firstName} ${lastName}</li>    
    <li>Email: ${email}</li>    
    <li>Phone number: ${phoneNumber}</li>    
  </ol> 
  
  <h3>Company Details</h3>
  <ol>
    <li>Company: ${company}</li>
    <li>Job title: ${jobTitle || "N/A"}</li>    
    <li>Number of employees: ${numberOfEmployees || "N/A"}</li>
  </ol>

  <h3>Message</h3>
  <p>${message}</p>
`;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const formData = new PayrollDownloadForm(_.pick(req.body, ['firstName', 'lastName', 'email', 'phoneNumber', 'company', 'numberOfEmployees']));
  await formData.save();
  sendEmail(output, "Payroll download form request");
  res.send(formData);
});

// Delete a payroll form
router.delete('/:formId', auth, async (req, res) => {
  const form = await PayrollDownloadForm.findByIdAndDelete(req.params.formId);
  if (!form) return res.status(404).send('The form with the given ID was not found');

  res.send(form);
});

module.exports = router;