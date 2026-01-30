import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.NOTIFY_EMAIL_USER,
    pass: process.env.NOTIFY_EMAIL_PASS,
  },
});

export const sendOrderNotification = async ({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}) => {
  await transporter.sendMail({
    from: process.env.NOTIFY_EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  });
};
