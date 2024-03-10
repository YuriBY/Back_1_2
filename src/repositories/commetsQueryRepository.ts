import { BlogDBType, BlogOutputType } from "../models/blogsType";
import { blogsCollection, commentsCollection } from "./db";
import { Pagination, SortData } from "../models/commonTypes";
import {
  CommentDBType,
  CommentOutType,
  CommentsQueryInputType,
} from "../models/comments";

export const commentsQueryRepository = {
  async getAllComments(
    postId: string,
    sortData: CommentsQueryInputType
  ): Promise<Pagination<CommentOutType> | {}> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;
    console.log(postId);

    let filter = {
      "commentatorInfo.postId": postId,
    };

    const result: CommentDBType[] = await commentsCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!result) return [];
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: result.map(({ _id, commentatorInfo, ...rest }) => ({
        id: _id,
        commentatorInfo: {
          userId: commentatorInfo.userId,
          userLogin: commentatorInfo.userLogin,
        },
        ...rest,
      })),
    };
  },

  // blogMapper(blog: BlogDBType): BlogOutputType {
  //   return {
  //     id: blog._id,
  //     name: blog.name,
  //     description: blog.description,
  //     websiteUrl: blog.websiteUrl,
  //     createdAt: blog.createdAt,
  //     isMembership: blog.isMembership,
  //   };
  // },

  // async getById(id: string): Promise<BlogOutputType | null> {
  //   const result: BlogDBType | null = await blogsCollection.findOne({
  //     _id: id,
  //   });
  //   if (!result) return null;
  //   return this.blogMapper(result);
  // },
};
