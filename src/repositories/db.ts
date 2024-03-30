import { IPandURLDbType, RefreshTokenDbType } from "./../models/commonTypes";
import { BlogDBType } from "../models/blogsType";
import { PostDBType } from "./../models/postType";
import { MongoClient } from "mongodb";
import { UserAccountDBType } from "../models/usersType";
import { appConfig } from "../common/config/appConfi";
import { CommentDBType } from "../models/comments";
import { scheduleNextTuesdayEvent } from "../application/clenerOfBlackList";

const mongoURI = appConfig.MONGO_URL;

if (!mongoURI) {
  throw new Error("!URL does not found");
}

export const client = new MongoClient(mongoURI);

export const blogsCollection = client.db().collection<BlogDBType>("blogs");
export const postCollection = client.db().collection<PostDBType>("posts");
export const usersCollection = client
  .db()
  .collection<UserAccountDBType>("users");
export const commentsCollection = client
  .db()
  .collection<CommentDBType>("comments");

export const refreshTokenCollection = client
  .db()
  .collection<RefreshTokenDbType>("blackList");

export const logsCollection = client.db().collection<IPandURLDbType>("logs");

export async function runDB() {
  try {
    scheduleNextTuesdayEvent();

    // connect client to server
    await client.connect();
    // establich and verify connection
    await client.db("project").command({ ping: 1 });
    console.log("Connected successfully to mongoserver");
  } catch {
    console.log("Can not connect to db");

    // ensures that client will close when you finished
    await client.close();
  }
}

export async function stopDB() {
  await client.close();
}
