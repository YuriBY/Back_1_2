import { db } from "../db/db";
import { PostType } from "../models/postType";

export class PostRepository {
  static getAll() {
    return db.posts;
  }

  static getById(id: Number) {
    return db.posts.find((b) => +b.id === +id);
  }

  static createPost(createData: PostType) {
    db.posts.push(createData);
    return createData;
  }

  static updatePost(
    id: Number,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const foundPost = db.posts.find((b) => +b.id === id)!;
    foundPost.title = title;
    (foundPost.shortDescription = shortDescription),
      (foundPost.content = content),
      (foundPost.blogId = blogId);
  }

  static deletePost(id: Number) {
    db.posts = db.posts.filter((b) => +b.id !== id);
  }

  static deleteAllPosts() {
    db.posts = [];
  }
}
