const winston = require('winston');
const config = require('config');
const nodemailer = require('nodemailer');

module.exports = async function (output, subject) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 25,
    secure: false,
    auth: {
      user: config.get('user.user'),
      pass: config.get('user.pass')
    }
  });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: `"Comprite Email Test" <${config.get('user.user')}>`, // sender address
      to: "ashraflobo@gmail.com", // list of receivers
      subject: subject, // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    winston.info(`Message sent: ${info.messageId}`);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
  catch (ex) { throw ex; }
};