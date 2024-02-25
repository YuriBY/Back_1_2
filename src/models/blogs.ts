import { Request, Response } from "express";

export type ParamType = {
  id: string;
};
export type RequestWithParams<P> = Request<P, {}, {}, {}>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithBody<T> = Request<{}, {}, T, {}>;
export type RequestWithBodyAndParams<P, T> = Request<P, {}, T, {}>;
export type RequestWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>;

export type ResponseType<T> = Response<T, {}>;

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

export type BlogQueryInputType = {
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type Pagination<I> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
};

export type CreatePostInBlogInputType = {
  title: string;
  shortDescription: string;
  content: string;
};
