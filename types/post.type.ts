import { UserType } from "./user.type";

export type PostType = {
  id: number;
  body: string;
  userId: number;
  comments: [];
  likedIds: number[];
  postImage: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
};
