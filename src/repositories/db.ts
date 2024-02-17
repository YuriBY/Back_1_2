import "dotenv/config";
import { BlogType } from "./../models/blogs";
import { PostType } from "./../models/postType";
import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URL;

if (!mongoURI) {
  throw new Error("!URL does not found");
}

export const client = new MongoClient(mongoURI);

export const blogsCollection = client.db().collection<BlogType>("blogs");
export const postCollection = client.db().collection<PostType>("posts");

export async function runDB() {
  try {
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
