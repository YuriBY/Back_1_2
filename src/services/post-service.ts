import { blogQueryRepository } from "./../repositories/blogQueryRepository";
import { PostCreateType, PostDBType, PostOutType } from "../models/postType";
import crypto from "crypto";
import { postRepository } from "../repositories/post-repository";
import { blogsCollection } from "../repositories/db";
import { BlogOutputType } from "../models/blogs";

export const postService = {
  // async getAll() {
  //   return await postRepository.getAll();
  // },

  // async getById(id: string): Promise<PostOutType | null> {
  //   return postRepository.getById(id);
  // },

  postMapper(post: PostDBType): PostOutType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },

  async createPost(createData: PostCreateType): Promise<PostOutType | null> {
    const { title, shortDescription, content, blogId } = createData;
    const foundBlog: BlogOutputType | null = await blogQueryRepository.getById(
      blogId
    );
    if (!foundBlog) {
      return null;
    }
    const foundBlogName = foundBlog.name;
    const newPost: PostDBType = {
      _id: crypto.randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: foundBlogName,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await postRepository.createPost(newPost);
    return createdPost;
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    return await postRepository.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
  },

  async deletePost(id: string) {
    return await postRepository.deletePost(id);
  },
};
