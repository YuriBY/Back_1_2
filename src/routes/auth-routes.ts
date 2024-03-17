import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { authValidator } from "../validators/auth-validator";
import { authService } from "../services/auth-service";
import { RequestWithBody } from "../models/commonTypes";
import {
  AuthBodyType,
  AuthRegistrationbBodyType,
  AuthUserType,
  CodeConfirmationOfRegistration,
  EmailConfirmationResendingType,
} from "../models/authType";
import { jwtService } from "../application/jwt-service";
import { UserAccountDBType, UserAccountOutType } from "../models/usersType";
import { authJWTMiddlewear } from "../middleweares/auth/authJWTmiddlewear";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { emailValidation, userValidator } from "../validators/user-validators";
import { emailAdapter } from "../adapters/emailAdapter";

export const authRoute = Router({});

authRoute.post(
  "/login",
  authValidator(),
  async (req: RequestWithBody<AuthBodyType>, res: Response) => {
    const receivedCredential: AuthBodyType = {
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
    };
    const user: UserAccountDBType | null = await authService.checkCredential(
      receivedCredential
    );
    if (!user) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }
    const token = await jwtService.createJWT(user);
    res.status(HTTP_STATUS.OK_200).send(token.data);
  }
);

authRoute.get("/me", authJWTMiddlewear, async (req: Request, res: Response) => {
  const userOutCredential: AuthUserType = {
    login: req.user!.accountData.userName,
    email: req.user!.accountData.email,
    userId: req.user!._id,
  };
  res.status(HTTP_STATUS.OK_200).send(userOutCredential);
});

authRoute.post(
  "/registration",
  userValidator(),
  async (req: RequestWithBody<AuthRegistrationbBodyType>, res: Response) => {
    const receivedCredential: AuthRegistrationbBodyType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };

    const isUserLoginExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.login
    );
    if (isUserLoginExists)
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Login Exists",
            field: "Login",
          },
        ],
      });
    const isUserEmailExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.email
    );
    if (isUserEmailExists)
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Email Exists",
            field: "Email",
          },
        ],
      });

    const user = authService.createUser(receivedCredential);

    if (!user) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/registration-confirmation",
  async (
    req: RequestWithBody<CodeConfirmationOfRegistration>,
    res: Response
  ) => {
    const result = await authService.confirmEmail(req.body.code);

    if (!result) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/registration-email-resending",
  emailValidation,
  async (
    req: RequestWithBody<EmailConfirmationResendingType>,
    res: Response
  ) => {
    const user = await usersQueryRepository.getByLoginOrEmail(req.body.emai);
    if (!user) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    await emailAdapter.sendMail(
      req.body.emai,
      "Resend email",
      user.emailConfirmation.confirmationCode
    );

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
