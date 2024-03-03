import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { blogValidator } from "../validators/blog-validators";
import {
  BlogCreateType,
  BlogOutputType,
  BlogQueryInputType,
} from "../models/blogsType";
import { HTTP_STATUS } from "../status/status1";
import { blogService } from "../services/blog-service";
import { CreatePostInBlogInputType, PostOutType } from "../models/postType";
import { blogQueryRepository } from "../repositories/blogQueryRepository";
import { postQueryRepository } from "../repositories/postQueryrepository";
import { postInBlogValidation } from "../validators/post-validator";
import {
  Pagination,
  ParamType,
  RequestWithBodyAndParams,
  RequestWithQuery,
  RequestWithQueryAndParams,
  ResponseType,
  SortData,
} from "../models/commonTypes";

export const blogRoute = Router({});

blogRoute.get(
  "/",
  async (
    req: RequestWithQuery<BlogQueryInputType>,
    res: ResponseType<Pagination<BlogOutputType> | {}>
  ) => {
    const sortData: SortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const blogs = await blogQueryRepository.getAll(sortData);
    res.send(blogs);
  }
);

blogRoute.get("/:id", async (req: Request, res: Response) => {
  const blog = await blogQueryRepository.getById(req.params.id);
  if (blog) {
    res.send(blog);
  } else {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }
});

blogRoute.get(
  "/:id/posts",
  async (
    req: RequestWithQueryAndParams<ParamType, BlogQueryInputType>,
    res: ResponseType<Pagination<PostOutType> | {}>
  ) => {
    const id = req.params.id;

    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    const sortData: SortData = {
      searchNameTerm: id,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const posts = await postQueryRepository.getAllPostsOfBlog(sortData);
    if (Object.keys(posts).length == 0) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.send(posts);
  }
);

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
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(createdBlog);
  }
);

blogRoute.post(
  "/:id/posts",
  authMiddlewear,
  postInBlogValidation(),
  async (
    req: RequestWithBodyAndParams<ParamType, CreatePostInBlogInputType>,
    res: Response
  ) => {
    const id = req.params.id;

    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    const createPostFromBlogModel = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
    };

    const post: PostOutType | null = await blogService.createPostToBlog(
      id,
      createPostFromBlogModel
    );

    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(post);
  }
);

blogRoute.put(
  "/:id",
  authMiddlewear,
  blogValidator(),
  async (
    req: RequestWithBodyAndParams<ParamType, BlogCreateType>,
    res: Response
  ) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
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
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
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
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const blogIsDeleted = await blogService.deleteBlog(id);
    if (!blogIsDeleted) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
