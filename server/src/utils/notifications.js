const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendAdminNotification = async (transaction) => {
  const mailOptions = {
    from: 'no-reply@flashex.com',
    to: 'admin@flashex.com',
    subject: 'New Transaction Request',
    text: `
      New ${transaction.action} request:
      User: ${transaction.userId}
      Crypto: ${transaction.crypto}
      Amount: ${transaction.amount}
      Fiat: ${transaction.fiat}
      Bank: ${transaction.bank}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to admin.');
  } catch (error) {
    console.error('Email error:', error);
  }
};

module.exports = { sendAdminNotification };