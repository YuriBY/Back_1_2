import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import {
  PostCreateType,
  PostDBType,
  PostQueryInputType,
} from "../models/postType";
import { postValidation } from "../validators/post-validator";
import { HTTP_STATUS } from "../status/status1";
import { postService } from "../services/post-service";
import { RequestWithQuery } from "../models/blogs";
import { SortData } from "../repositories/blogQueryRepository";
import { postQueryRepository } from "../repositories/postQueryrepository";

export const postRoute = Router({});

postRoute.get(
  "/",
  async (req: RequestWithQuery<PostQueryInputType>, res: Response) => {
    const sortData: SortData = {
      searchNameTerm: null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };

    const posts = await postQueryRepository.getAll(sortData);
    res.send(posts);
  }
);

postRoute.get("/:id", async (req: Request, res: Response) => {
  const post = await postQueryRepository.getById(req.params.id);
  if (post) {
    res.send(post);
  } else {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }
});

postRoute.post(
  "/",
  authMiddlewear,
  postValidation(),
  async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    const createdPost: PostCreateType | null = await postService.createPost({
      title,
      shortDescription,
      content,
      blogId,
    });
    if (!createdPost) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(createdPost);
  }
);

postRoute.put(
  "/:id",
  authMiddlewear,
  postValidation(),
  async (req: Request, res: Response) => {
    const post = await postQueryRepository.getById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      const { title, shortDescription, content, blogId } = req.body;
      // const id = +req.params.id;
      postService.updatePost(
        req.params.id,
        title,
        shortDescription,
        content,
        blogId
      );
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

postRoute.delete(
  "/:id",
  authMiddlewear,
  async (req: Request, res: Response) => {
    const post = await postQueryRepository.getById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      postService.deletePost(req.params.id);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
