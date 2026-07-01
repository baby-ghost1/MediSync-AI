import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,

    pass: process.env.SMTP_PASS,
  },

  // Do not leave an API request hanging indefinitely when the SMTP
  // provider is unavailable or misconfigured.
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!smtpConfigured) {
    console.warn("SMTP not configured. Skipping email send.");
    return null;
  }

  try {
    return await transporter.sendMail({
      from: `"MediSync AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    // Account/reset state has already been persisted by callers. Email
    // delivery is auxiliary and must not turn a successful write into a
    // misleading failed response that clients may retry.
    console.error("Email delivery failed:", error.message);
    return null;
  }
};

export default transporter;
