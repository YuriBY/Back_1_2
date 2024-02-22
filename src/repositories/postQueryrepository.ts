import { PostCreateType, PostDBType, PostOutType } from "../models/postType";
import { postCollection } from "./db";
import crypto from "crypto";

export const postQueryRepository = {
  async getAll() {
    const result: PostDBType[] = await postCollection.find({}).toArray();
    if (!result) return [];
    return result.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
  },

  async getById(id: string): Promise<PostOutType | null> {
    const result: PostDBType | null = await postCollection.findOne({ _id: id });
    if (!result) return null;
    return this.postMapper(result);
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
