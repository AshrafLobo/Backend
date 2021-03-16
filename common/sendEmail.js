const winston = require('winston');
const nodemailer = require('nodemailer');

module.exports = async function (output, subject) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aloboashi@gmail.com',
      pass: '88ElCG*jE6Hs'
    }
  });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: '"Comprite Email Test - Ashraf" <aloboashi@gmail.com>', // sender address
      to: "ashraflobo@gmail.com", // list of receivers
      subject: subject, // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    winston.info(`Message sent: ${info.messageId}`);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    winston.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
  catch (ex) { throw ex; }
};