import expressAsyncHandler from "express-async-handler";
import {
  addUserSchema,
  updateUserSchema,
  userIdSchema,
  userProfileSchema,
} from "../../schemas/userSchema";
import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "../../constants/http.codes";

export const validateAddUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      position,
      supervisor,
      department,
      password,
    } = req.body;

    const result = addUserSchema.safeParse({
      firstName,
      lastName,
      email,
      position,
      supervisor,
      department,
      password,
    });

    if (!result.success) {
      res.status(BAD_REQUEST);
      return next(result.error);
    }

    req.body = result.data;

    next();
  }
);

export const validateId = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedParams = userIdSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return next(parsedParams.error);
    }
    req.params = parsedParams.data;
    next();
  }
);

// export const validateUpdateUser = expressAsyncHandler(
//   async (req, res, next) => {
//     const result = updateUserSchema.safeParse(req.body);
//     if (!result.success) next(result.error);

//     req.body = result.data;
//     next();
//   }
// );

// export const validateGetUserProfile = expressAsyncHandler(
//   async (req, res, next) => {
//     const parsedUser = userProfileSchema.safeParse({
//       ...req.user,
//       _id: req.user._id.toString(),
//     });

//     if (!parsedUser.success) {
//       res.status(400);
//       return next(parsedUser.error);
//     }

//     next();
//   }
// );
