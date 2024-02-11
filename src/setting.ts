import express, { Request, Response } from "express";
import { HTTP_STATUS } from ".";
import { blogRoute } from "./routes/blog-routes";
import { postRoute } from "./routes/post-routes";
import { db } from "./db/db";

export const app = express();

const jsonBodyMiddlewear = express.json();
app.use(jsonBodyMiddlewear);

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);

app.delete("/testing/all-data", (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
