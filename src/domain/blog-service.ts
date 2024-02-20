import { blogRepository } from "./../repositories/blog-repository";
import { BlogCreateType, BlogDBType, BlogOutputType } from "../models/blogs";

import crypto from "crypto";

export const blogService = {
  async getAll(): Promise<BlogOutputType[] | []> {
    return await blogRepository.getAll();
  },

  async getById(id: string): Promise<BlogOutputType | null> {
    return await blogRepository.getById(id);
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
    const createdBlog = await blogRepository.createBlog(newBlog);
    return createdBlog;
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    return await blogRepository.updateBlog(id, name, description, websiteUrl);
  },

  async deleteBlog(id: string) {
    return await blogRepository.deleteBlog(id);
  },
};
