import { ObjectId } from "mongodb";
import { refreshTokenCollection } from "./db";
import { RefreshTokenDbType } from "../models/commonTypes";

export const jwtQueryRepository = {
  async addRefrshTokenInBlackList(
    refreshToken: string
  ): Promise<string | null> {
    const token = await refreshTokenCollection.insertOne({ refreshToken });

    if (!token) return null;
    return refreshToken;
  },

  async checkRefrshTokenInBlackList(refreshToken: string): Promise<boolean> {
    const token = await refreshTokenCollection.findOne({
      refreshToken: refreshToken,
    });
    if (token) return true;
    return false;
  },
};
