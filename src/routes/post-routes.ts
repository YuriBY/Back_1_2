import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { PostType } from "../models/postType";
import { postRepository } from "../repositories/post-repository";
import { postValidation } from "../validators/post-validator";
import { HTTP_STATUS } from "../status/status1";

export const postRoute = Router({});

postRoute.get("/", (req: Request, res: Response) => {
  const posts: PostType[] = postRepository.getAll();
  res.send(posts);
});

postRoute.get("/:id", (req: Request, res: Response) => {
  const post: PostType | undefined = postRepository.getById(+req.params.id);
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
    const createdPost: PostType = postRepository.createPost(newPost);
    res.status(HTTP_STATUS.CREATED_201).send(createdPost);
  }
);

postRoute.put(
  "/:id",
  authMiddlewear,
  postValidation(),
  (req: Request, res: Response) => {
    const post = postRepository.getById(+req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      const { title, shortDescription, content, blogId } = req.body;
      const id = +req.params.id;
      postRepository.updatePost(id, title, shortDescription, content, blogId);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

postRoute.delete("/:id", authMiddlewear, (req: Request, res: Response) => {
  const post = postRepository.getById(+req.params.id);
  if (!post) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  } else {
    postRepository.deletePost(+req.params.id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
});

postRoute.delete("/testing/all-data", (req: Request, res: Response) => {
  postRepository.deleteAllPosts();
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
