import { object, string } from "zod";

export const postSchema = object({
  body: string({ required_error: "Body is required" }).min(
    1,
    "Body is required"
  ),
  postImage: string(),
});
