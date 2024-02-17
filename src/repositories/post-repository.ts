import { PostType } from "../models/postType";
import { client, postCollection } from "./db";

export const postRepository = {
  async getAll() {
    return postCollection.find({}).toArray();
  },

  async getById(id: string) {
    return await postCollection.findOne({ id: id });
  },

  async createPost(createData: PostType) {
    const { id, title, shortDescription, content, blogId, blogName } =
      createData;
    const result = await postCollection.insertOne({
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });
    return { ...createData, _id: result.insertedId };
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const result = await postCollection.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return result.matchedCount === 1;
  },

  async deletePost(id: string) {
    const result = await postCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
