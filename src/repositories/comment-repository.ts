import { CommentOutType } from "./../models/comments";
import { CommentDBType } from "../models/comments";
import { commentsCollection } from "./db";

export const commentRepository = {
  // async getAll() {
  //   const result: PostDBType[] = await postCollection.find({}).toArray();
  //   if (!result) return [];
  //   return result.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
  // },

  // async getById(id: string): Promise<PostOutType | null> {
  //   const result: PostDBType | null = await postCollection.findOne({ _id: id });
  //   if (!result) return null;
  //   return this.postMapper(result);
  // },

  commentMapper(comment: CommentDBType): CommentOutType {
    return {
      id: comment._id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
    };
  },

  async createComment(newComment: CommentDBType): Promise<CommentOutType> {
    const result = await commentsCollection.insertOne(newComment);
    return this.commentMapper(newComment);
  },

  // async updatePost(
  //   id: string,
  //   title: string,
  //   shortDescription: string,
  //   content: string,
  //   blogId: string
  // ) {
  //   const result = await postCollection.updateOne(
  //     { _id: id },
  //     { $set: { title, shortDescription, content, blogId } }
  //   );
  //   return result.matchedCount === 1;
  // },

  // async deletePost(id: string) {
  //   const result = await postCollection.deleteOne({ _id: id });
  //   return result.deletedCount === 1;
  // },
};
