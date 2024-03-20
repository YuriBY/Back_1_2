import express, { Request, Response } from "express";
import { blogRoute } from "./routes/blog-routes";
import { postRoute } from "./routes/post-routes";
import {
  blogsCollection,
  commentsCollection,
  postCollection,
  usersCollection,
} from "./repositories/db";
import { HTTP_STATUS } from "./status/status1";
import { authRoute } from "./routes/auth-routes";
import { userRoute } from "./routes/users-routes";
import { commentsRoute } from "./routes/comments-routes";
import { emailRouter } from "./routes/email-routes";
import cookieParser from "cookie-parser";

export const app = express();

const jsonBodyMiddlewear = express.json();
app.use(jsonBodyMiddlewear);
app.use(cookieParser());

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/comments", commentsRoute);
app.use("/email", emailRouter);

app.delete("/testing/all-data", (req: Request, res: Response) => {
  blogsCollection.deleteMany({});
  postCollection.deleteMany({});
  usersCollection.deleteMany({});
  commentsCollection.deleteMany({});
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
