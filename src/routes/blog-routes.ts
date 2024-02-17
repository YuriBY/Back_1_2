import { Router, Request, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { blogValidator } from "../validators/blog-validators";
import { blogRepository } from "../repositories/blog-repository";
import { BlogType } from "../models/blogs";
import { HTTP_STATUS } from "../status/status1";

export const blogRoute = Router({});

blogRoute.get("/", async (req: Request, res: Response) => {
  const blogs = await blogRepository.getAll();
  res.send(blogs);
});

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
    const { name, description, websiteUrl } = req.body;
    const newBlog: BlogType = {
      id: new Date().getTime().toString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    const createdBlog: BlogType = await blogRepository.createBlog(newBlog);
    res.status(HTTP_STATUS.CREATED_201).send(createdBlog);
  }
);

blogRoute.put(
  "/:id",
  authMiddlewear,
  blogValidator(),
  async (req: Request, res: Response) => {
    const blog = blogRepository.getById(req.params.id);
    if (!blog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      const { name, description, websiteUrl } = req.body;
      const id = req.params.id;
      const updatedBlog = await blogRepository.updateBlog(
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
    const blog = await blogRepository.getById(req.params.id);
    if (!blog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      blogRepository.deleteBlog(req.params.id);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
