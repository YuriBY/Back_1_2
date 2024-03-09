import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { authValidator } from "../validators/auth-validator";
import { authService } from "../services/auth-service";
import { RequestWithBody } from "../models/commonTypes";
import { AuthBodyType } from "../models/authType";
import { jwtService } from "../application/jwt-service";
import { UserDBType } from "../models/usersType";
import { log } from "console";

export const authRoute = Router({});

authRoute.post(
  "/login",
  authValidator(),
  async (req: RequestWithBody<AuthBodyType>, res: Response) => {
    const receivedCredential: AuthBodyType = {
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
    };
    const user: UserDBType | null = await authService.checkCredential(
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
