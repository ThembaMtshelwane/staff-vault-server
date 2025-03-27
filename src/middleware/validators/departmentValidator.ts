import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  addDepartmentSchema,
  departmentsListSchema,
  updateDepartmentSchema,
} from "../../schemas/departmentSchema";
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

export const validateAddDepartment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, supervisor, positions } = req.body;

    const result = addDepartmentSchema.safeParse({
      name,
      supervisor,
      positions,
    });
    if (!result.success) {
      res.status(400);
      return next(result.error);
    }

    req.body = { name, supervisor, positions };
    next();
  }
);

export const validateUpdateDepartment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, positions, supervisor } = req.body;

    const result = updateDepartmentSchema.safeParse({
      id,
      name,
      positions,
      supervisor,
    });
    if (!result.success) {
      res.status(400);
      return next(result.error);
    }
    req.params.id = result.data.id as string;
    req.body.name = result.data.name;
    req.body.positions = result.data.positions;
    req.body.supervisor = result.data.supervisor;

    next();
  }
);
