import {
  BlogCreateType,
  BlogDBType,
  BlogOutputType,
} from "../models/blogsType";
import { BlogsModel } from "./db";

export const blogRepository = {
  // async getById(id: string): Promise<BlogDBType | null> {
  //   const result: BlogDBType | null = await blogsCollection.findOne({
  //     _id: id,
  //   });
  //   if (!result) return null;
  //   return result;
  // },

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

  async createBlog(newBlog: BlogDBType): Promise<BlogOutputType> {
    const result = await BlogsModel.insertMany([newBlog]);
    return this.blogMapper(newBlog);
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const result = await BlogsModel.updateOne(
      { _id: id },
      { $set: { name, description, websiteUrl } }
    );
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string) {
    const result = await BlogsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};
