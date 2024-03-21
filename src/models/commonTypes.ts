import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export type ParamType = {
  id: string;
};
export type RequestWithParams<P> = Request<P, {}, {}, {}>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithBody<T> = Request<{}, {}, T, {}>;
export type RequestWithBodyAndParams<P, T> = Request<P, {}, T, {}>;
export type RequestWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>;
export type ResponseType<T> = Response<T, {}>;

export type Pagination<I> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
};

export type SortData = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};

export type Content = {
  content: string;
};

export type RefreshTokenDbType = {
  _id: ObjectId;
  refreshToken: string;
  exp: number;
};
