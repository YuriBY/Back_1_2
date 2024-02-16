import { db } from "../db/db";
import { BlogType } from "../models/blogs";

export const blogRepository = {
  getAll() {
    return db.blogs
  },

  getById(id: Number) {
    return db.blogs.find((b) => +b.id === +id);
  },
    
  createBlog(createData: BlogType) {
    db.blogs.push(createData);
    return createData;
  },
    
  updateBlog(
    id: Number,
    name: string,
    description: string,
    websiteUrl: string
  ) {
      const foundBlog = db.blogs.find((b) => +b.id === id)!;
      foundBlog.name = name;
      foundBlog.description = description;
      foundBlog.websiteUrl = websiteUrl;
      },
    
  deleteBlog(id: Number) {
    db.blogs = db.blogs.filter((b) => +b.id !== id);
  },
    
  deleteAllBlogs() {
    db.blogs = [];
      }
}