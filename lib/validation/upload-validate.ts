import { object, string } from "zod";

export const uploadSchema = object({
  file: string({ required_error: "File is required" }).min(
    1,
    "File is required"
  ),
});
