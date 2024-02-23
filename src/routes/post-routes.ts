import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { PostCreateType, PostDBType } from "../models/postType";
import { postValidation } from "../validators/post-validator";
import { HTTP_STATUS } from "../status/status1";
import { postService } from "../services/post-service";

export const postRoute = Router({});

postRoute.get("/", async (req: Request, res: Response) => {
  const posts = await postService.getAll();
  res.send(posts);
});

postRoute.get("/:id", async (req: Request, res: Response) => {
  const post = await postService.getById(req.params.id);
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
    const createdPost: PostCreateType = await postService.createPost({
      title,
      shortDescription,
      content,
      blogId,
    });
    res.status(HTTP_STATUS.CREATED_201).send(createdPost);
  }
);

postRoute.put(
  "/:id",
  authMiddlewear,
  postValidation(),
  async (req: Request, res: Response) => {
    const post = await postService.getById(req.params.id);
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
    const post = await postService.getById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      postService.deletePost(req.params.id);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
