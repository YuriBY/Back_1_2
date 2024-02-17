import express, { Request, Response } from "express";
import { blogRoute } from "./routes/blog-routes";
import { postRoute } from "./routes/post-routes";
import { blogsCollection, postCollection, runDB } from "./repositories/db";
import { HTTP_STATUS } from "./status/status1";
import "dotenv/config";

export const app = express();

const jsonBodyMiddlewear = express.json();
app.use(jsonBodyMiddlewear);

const port = process.env.PORT || 5000;

// const port = 5000;

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);

app.delete("/testing/all-data", (req: Request, res: Response) => {
  blogsCollection.deleteMany({});
  postCollection.deleteMany({});
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

const startApp = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

//
startApp();
