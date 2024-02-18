import { PostCreateType, PostDBType, PostOutType } from "../models/postType";
import { postCollection } from "./db";
import crypto from "crypto";

export const postRepository = {
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

  async createPost(createData: PostCreateType): Promise<PostOutType> {
    const { title, shortDescription, content, blogId } = createData;
    const newPost: PostDBType = {
      _id: crypto.randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: "New name",
      createdAt: new Date().toISOString(),
    };
    const result = await postCollection.insertOne(newPost);
    return this.postMapper(newPost);
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const result = await postCollection.updateOne(
      { _id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return result.matchedCount === 1;
  },

  async deletePost(id: string) {
    const result = await postCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};
