import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});

// Signup validation schema
export const signUpSchema = object({
  name: string({ required_error: "Name is required" }).min(
    1,
    "Name is required"
  ),

  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be less than 30 characters"),

  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),

  password: string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),

  dateOfBirth: string({ required_error: "Date of birth is required" }).refine(
    (value) => !isNaN(Date.parse(value)), // Validate that it's a valid date string
    { message: "Invalid date format" }
  ),
});
