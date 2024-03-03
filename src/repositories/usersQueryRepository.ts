import { usersCollection } from "./db";
import { Pagination } from "../models/commonTypes";
import { UserDBType, UserOutType, UserSortData } from "../models/usersType";

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

    let filter = {};
    if (searchLoginTerm) {
      filter = {
        login: {
          $regex: sortData.searchLoginTerm,
          $options: "i",
        },
      };
    } else if (searchEmailTerm) {
      filter = {
        email: {
          $regex: sortData.searchEmailTerm,
          $options: "i",
        },
      };
    }

    const result: UserDBType[] = await usersCollection
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
      items: result.map(({ _id, login, email, createdAt, hash }) => ({
        id: _id,
        login,
        email,
        createdAt,
      })),
    };
  },

  async doUserExistInDb(
    login?: string | undefined,
    email?: string | undefined
  ): Promise<UserDBType[]> {
    const filter = {
      $or: [{ login: login ?? "" }, { email: email ?? "" }],
    };
    const result: UserDBType[] = await usersCollection.find(filter).toArray();
    return result;
  },
};
