import { blogRepository } from "../repositories/blog-repository";
import {
  BlogCreateType,
  BlogDBType,
  BlogOutputType,
  CreatePostInBlogInputType,
} from "../models/blogs";
import crypto from "crypto";
import { PostDBType, PostOutType } from "../models/postType";
import { postRepository } from "../repositories/post-repository";
import { postQueryRepository } from "../repositories/postQueryrepository";
import { blogQueryRepository } from "../repositories/blogQueryRepository";

export const blogService = {
  async createBlog(createData: BlogCreateType): Promise<BlogOutputType | null> {
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
    if (!createdBlog) {
      return null;
    }
    return createdBlog;
  },

  async createPostToBlog(
    blogId: string,
    createPostModel: CreatePostInBlogInputType
  ): Promise<PostOutType | null> {
    const { title, shortDescription, content } = createPostModel;
    const blog = await blogQueryRepository.getById(blogId);
    if (!blog) {
      return null;
    }

    const newPost: PostDBType = {
      _id: crypto.randomUUID(),
      title,
      content,
      shortDescription,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost: PostOutType = await postRepository.createPost(newPost);

    if (!createdPost) {
      return null;
    }

    const post: PostOutType | null = await postQueryRepository.getById(
      createdPost.id
    );

    if (!post) {
      return null;
    }
    return post;
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const blog = await blogQueryRepository.getById(id);
    if (!blog) {
      return null;
    }
    return await blogRepository.updateBlog(id, name, description, websiteUrl);
  },

  async deleteBlog(id: string) {
    const blog = await blogQueryRepository.getById(id);
    if (!blog) {
      return null;
    }
    return await blogRepository.deleteBlog(id);
  },
};
