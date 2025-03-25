import { z } from "zod";
import { basicUserInfoSchema } from "./genericSchema";

const staffEmailsSchema = z
  .string()
  .email({ message: "Please enter emails" })
  .array()
  .nonempty({ message: "Please enter a list of staff emails" });

const adminSchema = basicUserInfoSchema;

const loginSchema = z.object({
  email: z.string().min(1, "Please enter email").email("Please enter email"),
  password: z.string().min(1),
});

export { staffEmailsSchema, adminSchema, loginSchema };
