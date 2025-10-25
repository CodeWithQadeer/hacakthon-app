// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,  // ✅ Your Gmail address
        pass: process.env.GMAIL_PASS,  // ✅ 16-character App Password
      },
    });

    const mailOptions = {
      from: `"Improve My City" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,  // ✅ Plain text fallback
      html,  // ✅ HTML content (if provided)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to, "| Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email send error:", error.message);
  }
};
