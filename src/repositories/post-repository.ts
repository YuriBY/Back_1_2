import { db } from "../db/db";
import { PostType } from "../models/postType";

export const postRepository = {
  getAll() {
    return db.posts;
  },
  
  getById(id: Number) {
    return db.posts.find((b) => +b.id === +id);
  },
  
  createPost(createData: PostType) {
    db.posts.push(createData);
     return createData;
  },
  
  updatePost(
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
  },
  
  deletePost(id: Number) {
    db.posts = db.posts.filter((b) => +b.id !== id);
  },
  
  deleteAllPosts() {
    db.posts = [];
  }
  }
  