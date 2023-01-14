const nodemailer = require('nodemailer');

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: true,
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

module.exports = sendEmail;
