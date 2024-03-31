import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { authValidator } from "../validators/auth-validator";
import { authService } from "../services/auth-service";
import {
  ParamType,
  RequestWithBody,
  RequestWithParams,
} from "../models/commonTypes";
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
import { deviceQueryRepository } from "../repositories/deviceQueryRepository";
import { deviceRepository } from "../repositories/deviceRepository";

export const devicesRoute = Router({});

devicesRoute.get(
  "/",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const result = await deviceQueryRepository.getAll(req.user!._id);

    res.status(HTTP_STATUS.OK_200).send(result);
  }
);

devicesRoute.delete(
  "/",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const result = await deviceRepository.deleteAllDeviceExceptOne(
      req.user!._id
    );
    if (!result) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

devicesRoute.delete(
  "/:id",
  authREfreshJWTMiddlewear,
  async (req: RequestWithParams<ParamType>, res: Response) => {
    const result = await deviceRepository.deleteDevice(
      req.params.id,
      req.user!._id
    );
    if (!result) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
