import { PostOutType } from "../models/postType";
import crypto from "crypto";
import {
  CommentDBType,
  CommentOutType,
  InputObjForComment,
} from "../models/comments";
import { postQueryRepository } from "../repositories/postQueryrepository";
import { commentRepository } from "../repositories/comment-repository";

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

  //   async updatePost(
  //     id: string,
  //     title: string,
  //     shortDescription: string,
  //     content: string,
  //     blogId: string
  //   ) {
  //     return await postRepository.updatePost(
  //       id,
  //       title,
  //       shortDescription,
  //       content,
  //       blogId
  //     );
  //   },

  //   async deletePost(id: string) {
  //     return await postRepository.deletePost(id);
  //   },
};
