import mongoose from "mongoose";
import { z } from "zod";
import {
  objectIdSchema,
  passwordSchema,
  positionSchema,
  userInfoSchema,
} from "./genericSchema";

export const addUserSchema = userInfoSchema;



export const userIdSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid user ID ",
  }),
});

export const userProfileSchema = z.object({
  _id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid user ID ",
  }),
  firstName: z.string(),
  lastName: z.string(),
  position: z.string().optional(),
  department: z
    .string()
    .nullable()
    .refine((val) => val === null || mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid department ID",
    }),
  supervisor: z
    .string()
    .nullable()
    .refine((val) => val === null || mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid supervisor ID",
    }),
  email: z.string().min(1, "Please enter email").email("Please enter emails"),
  password: z.string(),
  role: z.string().min(1, "Please enter role"),
  permissions: z.array(z.string()).nonempty(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  password: passwordSchema.optional(),
  position: positionSchema,
  department: objectIdSchema,
  supervisor: objectIdSchema,
});
