import expressAsyncHandler from "express-async-handler";
import {
  staffEmailsSchema,
  adminSchema,
  loginSchema,
} from "../../schemas/authSchema";
import { NextFunction, Response, Request } from "express";
import { IUser } from "../../detinitions";

type TypedRequestBody<T> = Request<{}, {}, T>;
type TypedRequestParams<T> = Request<T, {}, {}>;

export const validateRegisterAllUsers = expressAsyncHandler(
  async (
    req: TypedRequestBody<{ staffEmails: string[] }>,
    res: Response,
    next: NextFunction
  ) => {
    const { staffEmails } = req.body;
    const result = staffEmailsSchema.safeParse(staffEmails);

    if (!result.success) {
      return next(result.error);
    }

    req.body.staffEmails = result.data;
    next();
  }
);

export const validateRegisterAdmin = expressAsyncHandler(
  async (
    req: TypedRequestBody<Partial<IUser>>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, firstName, lastName } = req.body;
    const result = adminSchema.safeParse({ email, firstName, lastName });

    console.log("result  ", result);

    if (!result.success) {
      return next(result.error);
    }
    req.body = result.data;
    next();
  }
);

export const validateLogin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return next(result.error);
  }
  req.body = result.data;
  next();
});
