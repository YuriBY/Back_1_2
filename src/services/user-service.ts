import crypto from "crypto";
import { UserDBType, UserOutType, inputUserType } from "../models/usersType";
import { bcryprService } from "./bcrypt-service";
import { usersRepository } from "../repositories/user-repository";
import { usersQueryRepository } from "../repositories/usersQueryRepository";

export const userService = {
  async createUser(createData: inputUserType): Promise<UserOutType | null> {
    const { login, password, email } = createData;
    // const user = await usersQueryRepository.doUserExistInDb(login);
    // console.log(user);

    // if (user) return null;
    const hash = await bcryprService.generateHash(password);
    const newUser: UserDBType = {
      _id: crypto.randomUUID(),
      login,
      hash,
      email,
      createdAt: new Date().toISOString(),
    };
    const createdUser = await usersRepository.createUser(newUser);
    return createdUser;
  },

  async deleteUser(id: string) {
    return await usersRepository.deleteUser(id);
  },
};
