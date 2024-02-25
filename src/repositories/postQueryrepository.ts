import { log } from "console";
import { Pagination } from "../models/blogs";
import { PostCreateType, PostDBType, PostOutType } from "../models/postType";
import { SortData } from "./blogQueryRepository";
import { postCollection } from "./db";
import crypto from "crypto";

export const postQueryRepository = {
  async getAll(sortdata: SortData) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortdata;

    const posts: PostDBType[] = await postCollection
      .find({})
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!posts) return [];
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
    };
  },

  async getById(id: string): Promise<PostOutType | null> {
    const result: PostDBType | null = await postCollection.findOne({ _id: id });
    if (!result) return null;
    return this.postMapper(result);
  },

  async getAllPostsOfBlog(
    sortData: SortData
  ): Promise<Pagination<PostOutType> | {}> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      sortData;

    let filter = {};
    if (searchNameTerm) {
      filter = {
        blogId: {
          $regex: sortData.searchNameTerm,
        },
      };
    }
    const result: PostDBType[] = await postCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!result.length) return {};
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: result.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
    };
  },

  postMapper(post: PostDBType): PostOutType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};
