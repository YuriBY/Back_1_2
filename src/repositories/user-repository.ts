import { UserDBType, UserOutType } from "../models/usersType";
import { blogsCollection, usersCollection } from "./db";

export const usersRepository = {
  userMapper(user: UserDBType): UserOutType {
    return {
      id: user._id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  async createUser(newUser: UserDBType): Promise<UserOutType> {
    const result = await usersCollection.insertOne(newUser);
    return this.userMapper(newUser);
  },

  async deleteUser(id: string) {
    const result = await usersCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};
