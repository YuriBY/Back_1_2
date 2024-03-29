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
import { authREfreshJWTMiddlewear } from "../middleweares/auth/authRefreshJWTmiddlewear";

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
    const token_A = await jwtService.createJWT_A(user);
    const token_R = await jwtService.createJWT_R(user);

    res.cookie("refreshToken", token_R, {
      httpOnly: true,
      secure: true,
    });
    res.status(HTTP_STATUS.OK_200).send(token_A.data);
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

    const isUserEmailExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.email
    );

    if (isUserEmailExists) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Email Exists",
            field: "email",
          },
        ],
      });
      return;
    }

    const isUserLoginExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.login
    );

    if (isUserLoginExists) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Login Exists",
            field: "login",
          },
        ],
      });
      return;
    }

    const user = await authService.createUser(receivedCredential);

    if (!user) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
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
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .send({ errorsMessages: [{ message: "Bad code", field: "code" }] });
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/registration-email-resending",
  emailValidation(),
  async (
    req: RequestWithBody<EmailConfirmationResendingType>,
    res: Response
  ) => {
    const user = await usersQueryRepository.getByLoginOrEmail(req.body.email);

    if (!user) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .send({ errorsMessages: [{ message: "Bad email", field: "email" }] });
      return;
    }
    if (user.emailConfirmation.isConfirmed) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .send({ errorsMessages: [{ message: "Bad email", field: "email" }] });
      return;
    } else {
      const result = await authService.reSendEmail(user);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

authRoute.post(
  "/refresh-token",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const token_A = await jwtService.createJWT_A(req.user!);
    const token_R = await jwtService.createJWT_R(req.user!);

    res.cookie("refreshToken", token_R, {
      httpOnly: true,
      secure: true,
    });
    res.status(HTTP_STATUS.OK_200).send(token_A.data);
  }
);

authRoute.post(
  "/logout",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
