import expressAsyncHandler from "express-async-handler";
import { uploadFileSchema } from "../../schemas/fileSchema";
import File from "../../model/fileModel";

export const uploadFileValidator = expressAsyncHandler(
  async (req, res, next) => {
    const result = uploadFileSchema.safeParse({
      file: req.file,
      employee: req.body.employee,
      documentType: req.body.documentType,
    });

    if (!result.success) {
      res.status(400);
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
