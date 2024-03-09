import { log } from "console";
import { AuthBodyType } from "../models/authType";
import { UserDBType } from "../models/usersType";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { bcryprService } from "./bcrypt-service";

export const authService = {
  async checkCredential(
    receivedCredential: AuthBodyType
  ): Promise<UserDBType | null> {
    const { loginOrEmail, password } = receivedCredential;
    const user: UserDBType | null =
      await usersQueryRepository.getByLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const checkPass = await bcryprService.checkPassword(password, user.hash);
    if (!checkPass) return null;
    return user;
  },
};
