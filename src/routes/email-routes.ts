import { body } from "express-validator";
import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { authService } from "../services/auth-service";
import { AuthBodyType, AuthUserType } from "../models/authType";
import { jwtService } from "../application/jwt-service";
import { UserDBType } from "../models/usersType";
import nodemailer from "nodemailer";
import { appConfig } from "../common/config/appConfi";
import { RequestWithBody } from "../models/commonTypes";
import { EmailToSendType } from "../models/emailToSendType";

export const emailRouter = Router({});

emailRouter.post(
  "/send",

  async (req: RequestWithBody<EmailToSendType>, res: Response) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: "a.ilin2024@mail.ru",
        pass: appConfig.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: "Admin <a.ilin2024@mail.ru>",
      to: req.body.email,
      subject: req.body.subject,
      html: "<h1>Hello</h1> <div><a href='https://onliner.by'>Click me</a></div>",
    });
    res
      .status(HTTP_STATUS.OK_200)
      .send({ email: req.body.email, subject: req.body.subject });
  }
);
