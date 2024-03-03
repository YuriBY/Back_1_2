import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { authValidator } from "../validators/auth-validator";
import { authService } from "../services/auth-service";
import { RequestWithBody } from "../models/commonTypes";
import { AuthBodyType } from "../models/authType";

export const authRoute = Router({});

authRoute.post(
  "/login",
  authValidator(),
  async (req: RequestWithBody<AuthBodyType>, res: Response) => {
    const receivedCredential: AuthBodyType = {
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
    };
    const credentialIsValued = await authService.checkCredential(
      receivedCredential
    );
    if (!credentialIsValued) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
