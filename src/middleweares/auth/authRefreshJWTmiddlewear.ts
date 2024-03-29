import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../status/status1";
import { jwtService } from "../../application/jwt-service";
import { userService } from "../../services/user-service";
import { jwtQueryRepository } from "../../repositories/jwtQueryRepository";
import { log } from "console";

export const authREfreshJWTMiddlewear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie_refreshtoken = req.cookies.refreshToken;
  console.log(cookie_refreshtoken);

  if (!cookie_refreshtoken) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const userData = await jwtService.getUserIdByRefreshToken(
    cookie_refreshtoken
  );
  console.log(userData);

  if (!userData || !userData.userId || !userData.exp) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const expireationDate = userData.exp * 1000;

  if (expireationDate < new Date().getTime()) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const isTokenInBlackList =
    await jwtQueryRepository.checkRefrshTokenInBlackList(cookie_refreshtoken);

  if (isTokenInBlackList) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }
  const result = await jwtQueryRepository.addRefrshTokenInBlackList(
    cookie_refreshtoken,
    expireationDate
  );
  req.user = await userService.findUserById(userData.userId);
  next();
};
