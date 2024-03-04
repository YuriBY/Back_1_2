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

    const filter = {
      $or : [
        { login: { $regex: searchLoginTerm ?? '', $options: 'i'} },
        { email: { $regex: searchEmailTerm ?? '', $options: 'i'} },
      ]
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

  async getByLoginOrEmail (loginOrEmail: string) : Promise<UserDBType | null> {
    const user : UserDBType | null = await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    return user

  }
};
