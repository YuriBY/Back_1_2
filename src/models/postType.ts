import { ObjectId } from "mongodb";

export type PostDBType = {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostCreateType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export type PostOutType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};
