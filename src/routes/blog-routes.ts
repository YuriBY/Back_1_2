import { ParamType } from "./../models/blogs";
import { blogsCollection, postCollection } from "./../repositories/db";
import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { blogValidator } from "../validators/blog-validators";
import {
  BlogCreateType,
  BlogOutputType,
  BlogQueryInputType,
  CreatePostInBlogInputType,
  Pagination,
  RequestWithBodyAndParams,
  RequestWithQuery,
  ResponseType,
} from "../models/blogs";
import { HTTP_STATUS } from "../status/status1";
import { blogService } from "../domain/blog-service";
import { blogQueryRepository } from "../repositories/blogQueryrepository";
import { ObjectId, SortDirection } from "mongodb";
import crypto from "crypto";
import { blogRepository } from "../repositories/blog-repository";
import { postService } from "../domain/post-service";
import { postRepository } from "../repositories/post-repository";
import { PostDBType, PostOutType } from "../models/postType";
import { postQueryRepository } from "../repositories/postQueryrepository";

export const blogRoute = Router({});

blogRoute.get(
  "/",
  async (
    req: RequestWithQuery<BlogQueryInputType>,
    res: ResponseType<Pagination<BlogOutputType> | {}>
  ) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: (req.query.sortDirection as SortDirection) ?? "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const blogs = await blogQueryRepository.getAll(sortData);
    res.send(blogs);
  }
);

blogRoute.get("/:id", async (req: Request, res: Response) => {
  const blog = await blogRepository.getById(req.params.id);
  if (blog) {
    res.send(blog);
  } else {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }
});

blogRoute.post(
  "/",
  authMiddlewear,
  blogValidator(),
  async (req: Request, res: Response) => {
    const { name, description, websiteUrl }: BlogCreateType = req.body;
    const createdBlog: BlogOutputType = await blogService.createBlog({
      name,
      description,
      websiteUrl,
    });
    res.status(HTTP_STATUS.CREATED_201).send(createdBlog);
  }
);

blogRoute.post(
  "/:id/posts",
  authMiddlewear,
  blogValidator(),
  async (
    req: RequestWithBodyAndParams<ParamType, CreatePostInBlogInputType>,
    res: Response
  ) => {
    const id = req.params.id;
    const { title, shortDescription, content }: CreatePostInBlogInputType =
      req.body;

    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    const blog = await blogRepository.getById(id);
    if (!blog) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    const newPost: PostDBType = {
      _id: crypto.randomUUID(),
      title,
      content,
      shortDescription,
      blogId: id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost: PostOutType = await postRepository.createPost(newPost);

    if (!createdPost) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    const post: PostOutType = await postQueryRepository.getById(createdPost.id);

    if (!post) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(post);
  }
);

blogRoute.put(
  "/:id",
  authMiddlewear,
  blogValidator(),
  async (req: Request, res: Response) => {
    const blog = await blogService.getById(req.params.id);
    if (!blog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      const { name, description, websiteUrl } = req.body;
      const id = req.params.id;
      const updatedBlog = await blogService.updateBlog(
        id,
        name,
        description,
        websiteUrl
      );
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

blogRoute.delete(
  "/:id",
  authMiddlewear,
  async (req: Request, res: Response) => {
    const blog = await blogService.getById(req.params.id);
    if (!blog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      blogService.deleteBlog(req.params.id);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
