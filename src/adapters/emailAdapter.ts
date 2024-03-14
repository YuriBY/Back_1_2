import nodemailer from "nodemailer";
import { appConfig } from "../common/config/appConfi";

export const emailAdapter = {
  async sendMail(email: string, subject: string) {
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: appConfig.EMAIL,
        pass: appConfig.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: `Admin <${appConfig.EMAIL}>`,
      to: email,
      subject: subject,
      html: "<h1>Hello</h1> <div><a href='https://onliner.by'>Click me</a></div>",
    });
  },
};
