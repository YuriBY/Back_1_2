import { emailAdapter } from "./../adapters/emailAdapter";
import { AuthBodyType, AuthRegistrationbBodyType } from "../models/authType";
import {
  UserAccountDBType,
  UserAccountOutType,
  UserDBType,
  UserOutType,
} from "../models/usersType";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { bcryprService } from "./bcrypt-service";
import { Result } from "../models/resultTypes";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { usersRepository } from "../repositories/user-repository";

export const authService = {
  async checkCredential(
    receivedCredential: AuthBodyType
  ): Promise<UserAccountDBType | null> {
    const { loginOrEmail, password } = receivedCredential;
    const user: UserAccountDBType | null =
      await usersQueryRepository.getByLoginOrEmail(loginOrEmail);
    if (!user || !user.emailConfirmation.isConfirmed) return null;
    const checkPass = await bcryprService.checkPassword(
      password,
      user.accountData.passwordHash
    );
    if (!checkPass) return null;
    return user;
  },

  async createUser(
    receivedCredential: AuthRegistrationbBodyType
  ): Promise<UserAccountOutType> {
    const { login, email, password } = receivedCredential;

    const passwordHash = await bcryprService.generateHash(password);
    const user: UserAccountDBType = {
      _id: crypto.randomUUID(),
      accountData: {
        userName: login,
        email,
        passwordHash,
        created: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDAte: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };
    const createResult: UserAccountOutType = await usersRepository.saveUser(
      user
    );
    try {
      await emailAdapter.sendMail(
        user.accountData.email,
        "Input data is accepted. Email with confirmation code will be send to passed email address",
        "toSend",
        user.emailConfirmation.confirmationCode
      );
    } catch (error) {
      console.log(error);
      
    }
    
    return createResult;
  },

  async confirmEmail(code: string): Promise<boolean> {
    const user: UserAccountDBType | null =
      await usersQueryRepository.findUserCode(code);
    if (!user) return false;
    if (user.emailConfirmation.expirationDAte < new Date()) {
      return false;
    }
    const result = usersRepository.uppdateUser(user._id);
    await emailAdapter.sendMail(
      user.accountData.email,
      "Email was verified. Account was activated"
    );
    return result;
  },
};
