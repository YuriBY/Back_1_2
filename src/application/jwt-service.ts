import { UserAccountDBType } from "./../models/usersType";
import jwt, { JwtPayload } from "jsonwebtoken";
import { appConfig } from "../common/config/appConfi";
import { refreshTokenCollection } from "../repositories/db";
import { jwtQueryRepository } from "../repositories/jwtQueryRepository";
import { RefreshTokenDbType } from "../models/commonTypes";
import crypto from "crypto";

const JWT_SECRET_A = appConfig.SECRET_KEY;
if (!JWT_SECRET_A) {
  throw new Error("!JWT_SECRET does not found");
}

const JWT_SECRET_R = appConfig.REFRESH_KEY;
if (!JWT_SECRET_R) {
  throw new Error("!JWT_SECRET does not found");
}

export const jwtService = {
  async createJWT_A(user: UserAccountDBType) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_A, {
      expiresIn: "10s",
    });
    return {
      data: {
        accessToken: token,
      },
    };
  },

  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, JWT_SECRET_A);

      if (typeof result === "string") {
        return null;
      } else {
        const payload = result as JwtPayload;
        return payload.userId;
      }
    } catch (error) {
      return null;
    }
  },

  async createJWT_R(user: UserAccountDBType) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_R, {
      expiresIn: "20m",
    });
    return token;
  },

  async getUserIdByRefreshToken(token: string) {
    try {
      const result = jwt.verify(token, JWT_SECRET_R);

      if (typeof result === "string") {
        return null;
      } else {
        const payload = result as JwtPayload;
        return {
          userId: payload.userId,
          exp: payload.exp,
        };
      }
    } catch (error) {
      return null;
    }
  },
};
