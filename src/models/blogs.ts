import { ObjectId } from "mongodb";

export type BlogDBType = {
  _id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogCreateType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogOutputType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
