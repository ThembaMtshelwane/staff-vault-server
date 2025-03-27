import { z } from "zod";
import { objectIdSchema } from "./genericSchema";

export const departmentBasicInfoSchema = z.object({
  name: z.string().min(3, "Department name must be atleast 3 characters long."),
  positions: z.array(z.string()).default([]),
});

export const departmentsListSchema = z
  .array(departmentBasicInfoSchema)
  .nonempty();

export const departmentNameSchema = z
  .string()
  .min(3, { message: "Department name must be atleast 3 characters lomg" });

export const departmentPositions = z
  .array(
    z
      .string()
      .min(3, { message: "Position name must be at least 3 characters long" })
  )
  .nonempty();

export const addDepartmentSchema = z.object({
  name: departmentNameSchema,
  supervisor: objectIdSchema,
  positions: departmentPositions,
});

export const updateDepartmentSchema = z.object({
  id: objectIdSchema,
  name: departmentNameSchema.optional(),
  positions: departmentPositions,
  supervisor: objectIdSchema.default(null),
});
