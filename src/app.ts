import express, { Request, Response } from "express";
import { blogRoute } from "./routes/blog-routes";
import { postRoute } from "./routes/post-routes";
import {
  blogsCollection,
  postCollection,
  runDB,
  usersCollection,
} from "./repositories/db";
import { HTTP_STATUS } from "./status/status1";
import "dotenv/config";
import { authRoute } from "./routes/auth-routes";
import { userRoute } from "./routes/users-routes";

export const app = express();

const jsonBodyMiddlewear = express.json();
app.use(jsonBodyMiddlewear);

export const port = process.env.PORT || 5000;

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);

app.delete("/testing/all-data", (req: Request, res: Response) => {
  blogsCollection.deleteMany({});
  postCollection.deleteMany({});
  usersCollection.deleteMany({});
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
