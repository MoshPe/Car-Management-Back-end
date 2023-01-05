const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'moshe.peretz318@gmail.com',
      pass: process.env.SMTP_PASSWORD,
    },
  })
);

module.exports = transporter;

//
// module.exports = ({ env }) => ({
//   // ...
//   email: {
//     provider: 'nodemailer',
//     providerOptions: {
//       host: env('SMTP_HOST', 'smtp.example.com'),
//       port: env('SMTP_PORT', 587),
//       auth: {
//         user: env('SMTP_USERNAME'),
//         pass: env('SMTP_PASSWORD'),
//       },
//       // ... any custom nodemailer options
//     },
//     settings: {
//       defaultFrom: 'hello@example.com',
//       defaultReplyTo: 'hello@example.com',
//     },
//   },
// });
//
