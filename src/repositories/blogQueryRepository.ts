import { Pagination } from "./../models/blogs";
import { SortDirection } from "mongodb";
import { BlogDBType, BlogOutputType } from "../models/blogs";
import { blogsCollection } from "./db";

type SortData = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export const blogQueryRepository = {
  async getAll(sortData: SortData): Promise<Pagination<BlogOutputType> | {}> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      sortData;

    let filter = {};
    if (searchNameTerm) {
      filter = {
        name: {
          $regex: sortData.searchNameTerm,
          $options: "i",
        },
      };
    }
    const result: BlogDBType[] = await blogsCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!result) return [];
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: result.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
    };
  },

  blogMapper(blog: BlogDBType): BlogOutputType {
    return {
      id: blog._id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },

  async getById(id: string): Promise<BlogOutputType | null> {
    const result: BlogDBType | null = await blogsCollection.findOne({
      _id: id,
    });
    if (!result) return null;
    return this.blogMapper(result);
  },
};
