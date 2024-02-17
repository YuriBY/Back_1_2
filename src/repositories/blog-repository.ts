import { BlogType } from "../models/blogs";
import { blogsCollection, client } from "./db";

export const blogRepository = {
  async getAll() {
    return blogsCollection.find({}).toArray();
  },

  async getById(id: string) {
    return await blogsCollection.findOne({
      id: id,
    });
  },

  async createBlog(createData: BlogType) {
    const { id, name, description, websiteUrl } = createData;
    const result = await blogsCollection.insertOne({
      id,
      name,
      description,
      websiteUrl,
    });
    return { ...createData, _id: result.insertedId };
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const result = await blogsCollection.updateOne(
      { id: id },
      { $set: { name, description, websiteUrl } }
    );
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string) {
    const result = await blogsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
