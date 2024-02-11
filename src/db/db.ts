import { BlogType } from "../models/blogs";
import { PostType } from "../models/postType";

export const db: { blogs: BlogType[]; posts: PostType[] } = {
  blogs: [
    {
      id: "123",
      name: "555",
      description: "qnsvdlbvfl",
      websiteUrl: "https://google.com",
    },
  ],
  posts: [],
};
