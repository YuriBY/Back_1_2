import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../status/status1";
import { jwtService } from "../../application/jwt-service";
import { userService } from "../../services/user-service";
import { deviceQueryRepository } from "../../repositories/deviceQueryRepository";
import { fromUnixTime, isPast } from "date-fns";
import { log } from "console";

export const authREfreshJWTMiddlewear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie_refreshtoken = req.cookies.refreshToken;
  console.log("cookie", cookie_refreshtoken);

  if (!cookie_refreshtoken) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const userData = await jwtService.getUserIdByRefreshToken(
    cookie_refreshtoken
  );
  console.log("нашел", userData);

  if (!userData || !userData.userId || !userData.exp) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const expirationDate = fromUnixTime(userData.exp);

  if (isPast(expirationDate)) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const isDeviceDataGood = await deviceQueryRepository.checkIdAndDate(
    userData.deviceId,
    userData.lastActivaDate,
    userData.userId
  );

  console.log(isDeviceDataGood);

  if (!isDeviceDataGood) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  // const isTokenInBlackList =
  //   await jwtQueryRepository.checkRefrshTokenInBlackList(cookie_refreshtoken);

  // if (isTokenInBlackList) {
  //   res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
  //   return;
  // }
  // const result = await jwtQueryRepository.addRefrshTokenInBlackList(
  //   cookie_refreshtoken,
  //   expireationDate
  // );
  req.user = await userService.findUserById(userData.userId);
  next();
};
