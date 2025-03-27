import path from "path";
import File from "../model/fileModel";
import { INTERNAL_SERVER_ERROR } from "../constants/http.codes";
import HTTP_Error from "../utils/httpError";
import { Request } from "express";

interface FileRequestBody extends Request {
  employee: string;
  documentType: string;
}
export const fileUploadService = async (
  fileData: Express.Multer.File | undefined,
  reqBody: FileRequestBody
) => {
  const relativePath = path.relative(process.cwd(), fileData!.path);
  const newFile = new File({
    name: fileData!.originalname,
    mimetype: fileData!.mimetype,
    path: relativePath,
    employee: reqBody.employee,
    documentType: reqBody.documentType,
  });
  const uploaded = await newFile.save();

  if (!uploaded) {
    throw new HTTP_Error("Failed to upload file", INTERNAL_SERVER_ERROR);
  }

  return uploaded;
};
