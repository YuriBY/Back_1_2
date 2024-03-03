import { log } from "console";
import { AuthBodyType } from "../models/authType";
import { UserDBType } from "../models/usersType";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { bcryprService } from "./bcrypt-service";

export const authService = {
  async checkCredential(receivedCredential: AuthBodyType): Promise<boolean> {
    const { loginOrEmail, password } = receivedCredential;
    let login;
    let email;
    if (loginOrEmail.includes("@")) {
      console.log("@@@@");

      email = loginOrEmail;
      const user: UserDBType[] = await usersQueryRepository.doUserExistInDb(
        email
      );
      if (!user.length) return false;
      const checkPass = bcryprService.checkPassword(password, user[0].hash);
      if (!checkPass) return false;
      return true;
    } else {
      console.log("dfss");

      login = loginOrEmail;
      const user: UserDBType[] = await usersQueryRepository.doUserExistInDb(
        login
      );
      console.log(user);

      if (!user.length) return false;
      const checkPass = bcryprService.checkPassword(password, user[0].hash);
      if (!checkPass) return false;
      return true;
    }
  },
};
