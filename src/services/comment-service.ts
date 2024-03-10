import { HTTP_STATUS } from "./../status/status1";
import { PostOutType } from "../models/postType";
import crypto from "crypto";
import {
  CommentDBType,
  CommentOutType,
  InputObjForComment,
  objForCommentDelete,
  objForCommentUpdate,
} from "../models/comments";
import { postQueryRepository } from "../repositories/postQueryrepository";
import { commentRepository } from "../repositories/comment-repository";
import { commentsQueryRepository } from "../repositories/commetsQueryRepository";
import { Result } from "../models/resultTypes";

export const commentService = {
  async sendComment(
    createData: InputObjForComment
  ): Promise<CommentOutType | null> {
    const { postId, content, userId, userLogin } = createData;

    const foundPost: PostOutType | null = await postQueryRepository.getById(
      postId
    );
    if (!foundPost) {
      return null;
    }

    const newComment: CommentDBType = {
      _id: crypto.randomUUID(),
      content,
      commentatorInfo: {
        userId,
        userLogin,
        postId,
      },
      createdAt: new Date().toISOString(),
    };
    const createdComment = await commentRepository.createComment(newComment);
    return createdComment;
  },

  async updateCommentContent(newObjForCommentUpdate: objForCommentUpdate) {
    const { commentId, content, userId, userLogin } = newObjForCommentUpdate;
    const foundedComment: CommentDBType | Result =
      await commentsQueryRepository.findDbTypeById(commentId);
    if ("code" in foundedComment) {
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    }
    if (foundedComment.commentatorInfo.userId !== userId) {
      return {
        code: HTTP_STATUS.FORBIDDEN_403,
      };
    }
    commentRepository.updateComment(foundedComment._id, content);
    return {
      code: HTTP_STATUS.NO_CONTENT_204,
    };
  },

  async deleteById(newObjToDelete: objForCommentDelete) {
    const { commentId, userId } = newObjToDelete;
    const foundedComment: CommentDBType | Result =
      await commentsQueryRepository.findDbTypeById(commentId);
    if ("code" in foundedComment) {
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    }
    if (foundedComment.commentatorInfo.userId !== userId) {
      return {
        code: HTTP_STATUS.FORBIDDEN_403,
      };
    }
    commentRepository.deleteComment(foundedComment._id);
    return {
      code: HTTP_STATUS.NO_CONTENT_204,
    };
  },
};
