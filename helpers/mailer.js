const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    console.log("Transporter: ", transporter);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
      html,
    };

    const result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Transporter Error: ", error);
        return error;
      }
      console.log("Email sent: ", info.response);
      return info;
    });
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {sendMail};
