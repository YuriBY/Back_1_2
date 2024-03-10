export type InputObjForComment = {
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
};

export type CommentDBType = {
  _id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type CommentOutType = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};
