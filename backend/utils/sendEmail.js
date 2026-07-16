const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Check if email credentials are configured in .env
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== "your-email@gmail.com";

    if (!isEmailConfigured) {
      console.warn("⚠️  EMAIL NOT CONFIGURED IN .ENV - Faking email delivery");
      console.log(`[MOCK EMAIL TO ${options.to}]:\nSubject: ${options.subject}\n\n${options.text || options.html}\n`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "School Election System"} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
