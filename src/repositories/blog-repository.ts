import { run } from "node:test";
import { BlogCreateType, BlogDBType, BlogOutputType } from "../models/blogs";
import { blogsCollection } from "./db";
import crypto from "crypto";

export const blogRepository = {
  async getAll(): Promise<BlogOutputType[] | []> {
    const result: BlogDBType[] = await blogsCollection.find({}).toArray();
    if (!result) return [];
    return result.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
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

  async createBlog(createData: BlogCreateType): Promise<BlogOutputType> {
    const { name, description, websiteUrl } = createData;
    const newBlog: BlogDBType = {
      _id: crypto.randomUUID(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const result = await blogsCollection.insertOne(newBlog);
    return this.blogMapper(newBlog);
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const result = await blogsCollection.updateOne(
      { _id: id },
      { $set: { name, description, websiteUrl } }
    );
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string) {
    const result = await blogsCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};
