import crypto from "crypto";
import {
  UserAccountDBType,
  UserAccountOutType,
  inputUserType,
} from "../models/usersType";
import { bcryprService } from "./bcrypt-service";
import { usersRepository } from "../repositories/user-repository";

export const userService = {
  async createUser(
    createData: inputUserType
  ): Promise<UserAccountOutType | null> {
    const { login, password, email } = createData;
    const hash = await bcryprService.generateHash(password);

    const newUser: UserAccountDBType = {
      _id: crypto.randomUUID(),
      accountData: {
        userName: login,
        email: email,
        passwordHash: hash,
        created: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: "",
        expirationDAte: new Date(),
        isConfirmed: true,
      },
    };
    const createdUser: UserAccountOutType = await usersRepository.createUser(
      newUser
    );
    return createdUser;
  },

  async findUserById(userId: string): Promise<UserAccountDBType | null> {
    const foundedUser = await usersRepository.findUserById(userId);
    return foundedUser;
  },

  async deleteUser(id: string) {
    return await usersRepository.deleteUser(id);
  },
};
