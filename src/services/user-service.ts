import crypto from "crypto";
import { UserDBType, UserOutType, inputUserType } from "../models/usersType";
import { bcryprService } from "./bcrypt-service";
import { usersRepository } from "../repositories/user-repository";

export const userService = {
  async createUser(createData: inputUserType): Promise<UserOutType | null> {
    const { login, password, email } = createData;
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

  async findUserById(userId: string): Promise<UserDBType | null> {
    const foundedUser = await usersRepository.findUserById(userId);
    return foundedUser;
  },

  async deleteUser(id: string) {
    return await usersRepository.deleteUser(id);
  },
};
