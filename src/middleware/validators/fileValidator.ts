import expressAsyncHandler from "express-async-handler";
import {
  deleteFileSchema,
  fileParamsSchema,
  uploadFileSchema,
} from "../../schemas/fileSchema";
import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "../../constants/http.codes";

export const uploadFileValidator = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = uploadFileSchema.safeParse({
      file: req.file,
      employee: req.body.employee,
      documentType: req.body.documentType,
    });

    if (!result.success) {
      res.status(BAD_REQUEST);
      return next(result.error);
    }
    req.file!.originalname = result.data.file.originalname;
    req.file!.mimetype = result.data.file.mimetype;
    req.file!.path = result.data.file.path;
    req.file!.size = result.data.file.size;
    req.body = {
      employee: result.data.employee,
      documentType: result.data.documentType,
    };
    next();
  }
);

export const downloadValidator = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = fileParamsSchema.safeParse(req.params.filename);
    if (!result.success) {
      return next(result.error);
    }
    req.params.filename = result.data;
    next();
  }
);

export const deleteFileValidator = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { filename, documentType } = req.params;
    const result = deleteFileSchema.safeParse({ filename, documentType });
    if (!result.success) {
      return next(result.error);
    }
    req.params = result.data;
    next();
  }
);
