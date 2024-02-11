import express, { Request, Response } from "express";
import { AvailableResolutions, HTTP_STATUS } from ".";
import {
  RequesWithParams,
  Param,
  RequesWithBody,
  CreateVideoType,
  ErrorType,
  VideoTypes,
  RequestWithBodyAndParams,
  UpdateVideoType,
} from "./models/models";

export const app = express();

const jsonBodyMiddlewear = express.json();
app.use(jsonBodyMiddlewear);

let videos: VideoTypes[] = [
  {
    id: 0,
    title: "string",
    author: "string",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2024-01-30T19:21:00.388Z",
    publicationDate: "2024-01-30T19:21:00.388Z",
    availableResolutions: ["P144"],
  },
];

app.get("/videos", (req: Request, res: Response) => {
  res.send(videos);
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  videos.length = 0;
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.get("/videos/:id", (req: RequesWithParams<Param>, res: Response) => {
  const foundVideos = videos.find((c) => c.id === +req.params.id);
  if (!foundVideos) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    return;
  }
  res.send(foundVideos);
});

app.post("/videos", (req: RequesWithBody<CreateVideoType>, res: Response) => {
  const errors: ErrorType = {
    errorsMessages: [],
  };

  let { title, author, availableResolutions } = req.body as CreateVideoType;

  if (
    !title ||
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 40
  ) {
    errors.errorsMessages.push({ message: "Incorrect title", field: "title" });
  }

  if (
    !author ||
    typeof author !== "string" ||
    !author.trim() ||
    author.trim().length > 20
  ) {
    errors.errorsMessages.push({
      message: "Incorrect author",
      field: "author",
    });
  }

  if (Array.isArray(availableResolutions)) {
    availableResolutions.forEach((r) => {
      if (!AvailableResolutions.includes(r)) {
        errors.errorsMessages.push({
          message: "Incorrect resolution",
          field: "availableResolutions",
        });
        return;
      }
      // else {
      //   availableResolutions = [];
      // }
    });
  }

  if (errors.errorsMessages.length) {
    res.status(HTTP_STATUS.BAD_REQUEST_400).send(errors);
    return;
  }

  const createdAt = new Date();
  const publicationDate = new Date();

  publicationDate.setDate(createdAt.getDate() + 1);

  const newVideo: VideoTypes = {
    id: +new Date(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    title,
    author,
    availableResolutions: availableResolutions || [],
  };

  videos.push(newVideo);
  res.status(HTTP_STATUS.CREATED_201).send(newVideo);
});

app.delete("/videos/:id", (req: RequesWithParams<Param>, res: Response) => {
  const foundVideos = videos.find((c) => c.id === +req.params.id);
  if (!foundVideos) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    return;
  }
  videos = videos.filter((c) => c.id !== +req.params.id);
  res.send(HTTP_STATUS.NO_CONTENT_204);
});

app.put(
  "/videos/:id",
  (req: RequestWithBodyAndParams<Param, UpdateVideoType>, res: Response) => {
    const errors: ErrorType = {
      errorsMessages: [],
    };
    let {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body as UpdateVideoType;

    if (
      !title ||
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 40
    ) {
      errors.errorsMessages.push({
        message: "Incorrect title",
        field: "title",
      });
    }

    if (
      !author ||
      typeof author !== "string" ||
      !author.trim() ||
      author.trim().length > 20
    ) {
      errors.errorsMessages.push({
        message: "Incorrect author",
        field: "author",
      });
    }

    if (typeof canBeDownloaded !== "boolean") {
      errors.errorsMessages.push({
        message: "Incorrect canBeDownloaded",
        field: "canBeDownloaded",
      });
    }

    if (minAgeRestriction !== null) {
      if (
        typeof minAgeRestriction !== "number" ||
        minAgeRestriction > 18 ||
        minAgeRestriction < 1
      ) {
        errors.errorsMessages.push({
          message: "Incorrect minAgeRestriction",
          field: "minAgeRestriction",
        });
      }
    }

    if (typeof publicationDate !== "string") {
      errors.errorsMessages.push({
        message: "Incorrect publicationDate",
        field: "publicationDate",
      });
    }

    if (availableResolutions.length === 0) {
      errors.errorsMessages.push({
        message: "Put resolution",
        field: "availableResolutions",
      });
    }

    if (Array.isArray(availableResolutions)) {
      availableResolutions.forEach((r) => {
        if (!AvailableResolutions.includes(r)) {
          errors.errorsMessages.push({
            message: "Incorrect resolution",
            field: "availableResolutions",
          });
          return;
        }
      });
    }

    if (errors.errorsMessages.length) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send(errors);
      return;
    }

    const foundVideos = videos.find((c) => c.id === +req.params.id);
    if (!foundVideos) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    foundVideos.author = author;
    foundVideos.title = title;
    foundVideos.availableResolutions = availableResolutions;
    foundVideos.canBeDownloaded = canBeDownloaded;
    foundVideos.minAgeRestriction = minAgeRestriction;
    foundVideos.publicationDate = publicationDate;
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
