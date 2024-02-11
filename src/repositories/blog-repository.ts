import { db } from "../db/db";
import { BlogType } from "../models/blogs";

export class BlogRepository {
  static getAll() {
    return db.blogs;
  }

  static getById(id: Number) {
    return db.blogs.find((b) => +b.id === +id);
  }

  static createBlog(createData: BlogType) {
    db.blogs.push(createData);
    return createData;
  }

  static updateBlog(
    id: Number,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const foundBlog = db.blogs.find((b) => +b.id === id)!;
    foundBlog.name = name;
    foundBlog.description = description;
    foundBlog.websiteUrl = websiteUrl;
  }

  static deleteBlog(id: Number) {
    db.blogs = db.blogs.filter((b) => +b.id !== id);
  }

  static deleteAllBlogs() {
    db.blogs = [];
  }
}
