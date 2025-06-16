import nodemailer from 'nodemailer';
import htmlBody from './email-body.js';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, booking, timeZone, html }) => {
  const emailHtml = html || htmlBody(booking, timeZone);
  return await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: emailHtml,
  });
};

export default sendEmail;
