import mongoose from "mongoose";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

export const positionSchema = z
  .string()
  .min(3, { message: "Position must be at least 3 characters long" })
  .optional();

export const pageSchema = z
  .string()
  .regex(/^\d+$/, "Page must be a valid number")
  .or(z.number())
  .default(1);

export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Object ID",
  })
  .or(z.null());

export const nonNullMongoIdSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid user ID ",
  }),
});

export const basicUserInfoSchema = z.object({
  firstName: z.string().min(1, "Please enter first name"),
  lastName: z.string().min(1, "Please enter last name"),
  email: z.string().min(1, "Please enter email").email("Please enter email"),
});

export const userInfoSchema = basicUserInfoSchema.extend({
  password: passwordSchema,
  position: positionSchema,
  department: objectIdSchema,
  supervisor: objectIdSchema,
});

export const fetchFilteredDocsSchema = z.object({
  page: pageSchema,
  search: z.string().optional().default(""),
  department: objectIdSchema,
});

export const departmentNameSchema = z
  .string()
  .min(1, { message: "Department must have a name" });

export const departmentPositions = z
  .array(z.string().min(1, { message: "Position cannot be empty" }))
  .optional()
  .default([]);
