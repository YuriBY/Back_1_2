import { Router, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import {
  Content,
  ParamType,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../models/commonTypes";
import {
  CommentOutType,
  objForCommentDelete,
  objForCommentUpdate,
} from "../models/comments";
import { commentsQueryRepository } from "../repositories/commetsQueryRepository";
import { authJWTMiddlewear } from "../middleweares/auth/authJWTmiddlewear";
import { contentValidation } from "../validators/post-validator";
import { commentService } from "../services/comment-service";
import { Result } from "../models/resultTypes";

export const commentsRoute = Router({});

commentsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<ParamType>,
    res: Response<CommentOutType | {}>
  ) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const comment = await commentsQueryRepository.getById(req.params.id);

    if (!comment) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.send(comment);
  }
);

commentsRoute.put(
  "/:id",
  authJWTMiddlewear,
  contentValidation(),
  async (req: RequestWithBodyAndParams<ParamType, Content>, res: Response) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const newObjForCommentUpdate: objForCommentUpdate = {
      commentId: req.params.id,
      content: req.body.content,
      userId: req.user!._id,
      userLogin: req.user!.login,
    };
    const updatedComment: Result = await commentService.updateCommentContent(
      newObjForCommentUpdate
    );

    if (updatedComment.code === 404) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else if (updatedComment.code === 403) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

commentsRoute.delete(
  "/:id",
  authJWTMiddlewear,
  async (req: RequestWithParams<ParamType>, res: Response) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const newObjForCommentDelete: objForCommentDelete = {
      commentId: req.params.id,
      userId: req.user!._id,
    };
    const commentIsDeleted = await commentService.deleteById(
      newObjForCommentDelete
    );
    if (commentIsDeleted.code === 404) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else if (commentIsDeleted.code === 403) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
