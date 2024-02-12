import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { HTTP_STATUS } from "../status/status";
import { PostType } from "../models/postType";
import { PostRepository } from "../repositories/post-repository";
import { postValidation } from "../validators/post-validator";

export const postRoute = Router({});

postRoute.get("/", (req: Request, res: Response) => {
  const posts: PostType[] = PostRepository.getAll();
  res.send(posts);
});

postRoute.get("/:id", (req: Request, res: Response) => {
  const post: PostType | undefined = PostRepository.getById(+req.params.id);
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
  (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost: PostType = {
      id: new Date().getTime().toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: "New name",
    };
    const createdPost: PostType = PostRepository.createPost(newPost);
    res.status(HTTP_STATUS.CREATED_201).send(createdPost);
  }
);

postRoute.put(
  "/:id",
  authMiddlewear,
  postValidation(),
  (req: Request, res: Response) => {
    const post = PostRepository.getById(+req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      const { title, shortDescription, content, blogId } = req.body;
      const id = +req.params.id;
      PostRepository.updatePost(id, title, shortDescription, content, blogId);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

postRoute.delete("/:id", authMiddlewear, (req: Request, res: Response) => {
  const post = PostRepository.getById(+req.params.id);
  if (!post) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  } else {
    PostRepository.deletePost(+req.params.id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
});

postRoute.delete("/testing/all-data", (req: Request, res: Response) => {
  PostRepository.deleteAllPosts();
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
