import jwt, { JwtPayload } from "jsonwebtoken";
import { UserDBType } from "../models/usersType";
import { appConfig } from "../common/config/appConfi";

const JWT_SECRET = appConfig.SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("!JWT_SECRET does not found");
}

export const jwtService = {
  async createJWT(user: UserDBType) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return {
      data: {
        accessToken: token,
      },
    };
  },

  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, JWT_SECRET);

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
};
