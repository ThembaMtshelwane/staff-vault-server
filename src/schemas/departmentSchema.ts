import { z } from "zod";

export const departmentBasicInfoSchema = z.object({
  name: z.string().min(3, "Department name must be atleast 3 characters long."),
  positions: z.array(z.string()).default([]),
});

export const departmentsListSchema = z
  .array(departmentBasicInfoSchema)
  .nonempty();
