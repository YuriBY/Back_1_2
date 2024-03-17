import { usersCollection } from "./db";
import { Pagination } from "../models/commonTypes";
import {
  UserAccountDBType,
  UserOutType,
  UserSortData,
} from "../models/usersType";

export const usersQueryRepository = {
  async getAll(sortData: UserSortData): Promise<Pagination<UserOutType> | {}> {
    const {
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = sortData;

    const filter = {
      $or: [
        {
          "accountData.userName": {
            $regex: searchLoginTerm ?? "",
            $options: "i",
          },
        },
        {
          "accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" },
        },
      ],
    };

    const result: UserAccountDBType[] = await usersCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!result) return [];
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: result.map(({ _id, accountData }) => ({
        id: _id,
        login: accountData.userName,
        email: accountData.email,
        createdAt: accountData.created,
      })),
    };
  },

  async getByLoginOrEmail(
    loginOrEmail: string
  ): Promise<UserAccountDBType | null> {
    const user: UserAccountDBType | null = await usersCollection.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.login": loginOrEmail },
      ],
    });
    return user;
  },

  async findUserCode(code: string): Promise<UserAccountDBType | null> {
    const user = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (!user) return null;
    return user;
  },
};
