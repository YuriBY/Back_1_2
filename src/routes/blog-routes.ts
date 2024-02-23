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
import { blogService } from "../services/blog-service";
import { blogRepository } from "../repositories/blog-repository";
import { postService } from "../services/post-service";
import { postRepository } from "../repositories/post-repository";
import { PostDBType, PostOutType } from "../models/postType";
import { postQueryRepository } from "../repositories/postQueryrepository";
import { blogQueryRepository } from "../repositories/blogQueryRepository";

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
      sortDirection: req.query.sortDirection ?? "desc",
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
    const createdBlog: BlogOutputType | null = await blogService.createBlog({
      name,
      description,
      websiteUrl,
    });
    if (!createdBlog) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    }
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
    
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    const createPostFromBlogModel = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content
    }

    const post : PostOutType | null = await blogService.createPostToBlog(id, createPostFromBlogModel )

    if (!post) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
      return
    }
    res.status(HTTP_STATUS.CREATED_201).send(post)
  }
);

blogRoute.put(
  "/:id",
  authMiddlewear,
  blogValidator(),
  async (req: RequestWithBodyAndParams<ParamType, BlogCreateType>, res: Response) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
      const { name, description, websiteUrl } = req.body;
      const updatedBlog = await blogService.updateBlog(
        id,
        name,
        description,
        websiteUrl
      );
      if (!updatedBlog) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
      }
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  );

blogRoute.delete(
  "/:id",
  authMiddlewear,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.send(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const blogIsDeleted = await blogService.deleteBlog(id);
    if(!blogIsDeleted) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
);
