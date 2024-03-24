import {
  UserAccountDBType,
  UserAccountOutType,
  UserOutType,
} from "../models/usersType";
import { usersCollection } from "./db";

export const usersRepository = {
  userBigObjMapper(user: UserAccountDBType): UserAccountOutType {
    return {
      id: user._id,
      accountData: {
        userName: user.accountData.userName,
        email: user.accountData.email,
        created: user.accountData.created,
      },
      emailConfirmation: {
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDAte: user.emailConfirmation.expirationDAte,
        isConfirmed: user.emailConfirmation.isConfirmed,
      },
    };
  },

  userMapper(user: UserAccountDBType): UserOutType {
    return {
      id: user._id,
      login: user.accountData.userName,
      email: user.accountData.email,
      createdAt: user.accountData.created,
    };
  },

  async createUser(newUser: UserAccountDBType): Promise<UserOutType> {
    const result = await usersCollection.insertOne(newUser);
    return this.userMapper(newUser);
  },

  async saveUser(newUser: UserAccountDBType): Promise<UserAccountOutType> {
    const result = await usersCollection.insertOne(newUser);
    return this.userBigObjMapper(newUser);
  },

  async deleteUser(id: string) {
    const result = await usersCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  async findUserById(userId: string): Promise<UserAccountDBType | null> {
    const result = await usersCollection.findOne({ _id: userId });
    if (!result) return null;
    return result;
  },

  async uppdateUser(userId: string): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.modifiedCount === 1;
  },

  async uppdateUserCode(
    userId: string,
    code: string,
    expirationDAte: Date
  ): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id: userId },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
          "emailCofirmation.expirationDAte": expirationDAte,
        },
      }
    );
    return result.modifiedCount === 1;
  },
};
