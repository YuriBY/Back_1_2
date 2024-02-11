import express, { Request, Response } from "express";
import { AvailableResolutions } from "..";

export type VideoTypes = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: typeof AvailableResolutions;
};

export type RequesWithParams<P> = Request<P, unknown, unknown, unknown>;

export type Param = {
  id: string;
};

export type RequesWithBody<B> = Request<unknown, B, unknown, unknown>;

export type CreateVideoType = {
  title: string;
  author: string;
  availableResolutions: typeof AvailableResolutions;
};

export type RequestWithBodyAndParams<P, B> = Request<P, B, unknown, unknown>;

export type UpdateVideoType = Omit<VideoTypes, "createdAt" & "id">;

export type ErrorMessageType = {
  field: string;
  message: string;
};

export type ErrorType = {
  errorsMessages: ErrorMessageType[];
};
