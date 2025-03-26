import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { departmentsListSchema } from "../../schemas/departmentSchema";
import { BAD_REQUEST } from "../../constants/http.codes";

export const validateMassDepartmentCreation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { departmentsList } = req.body;
    const result = departmentsListSchema.safeParse(departmentsList);

    if (!result.success) {
      res.status(BAD_REQUEST);
      return next(result.error);
    }

    req.body.departmentsList = result.data;
    next();
  }
);
