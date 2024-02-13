import { BlogType } from "../models/blogs";
import { PostType } from "../models/postType";

export const db: { blogs: BlogType[]; posts: PostType[] } = {
  blogs: [],
  posts: [],
};
