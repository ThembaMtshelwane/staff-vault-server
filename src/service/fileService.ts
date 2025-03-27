import path from "path";
import File from "../model/fileModel";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/http.codes";
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

export const fileDownloadService = async (filename: string) => {
  const file = await File.findOne({ name: filename });

  if (!file) {
    throw new HTTP_Error("File not found", NOT_FOUND);
  }

  const fullPath = path.join(process.cwd(), file.path);

  return { fullPath, filename };
};

export const getFilteredFilesService = async (documentType: string) => {
  const files = await File.find({ documentType }).exec();

  if (!files) {
    throw new HTTP_Error("HTTP_Error fetching file", INTERNAL_SERVER_ERROR);
  }

  return { files, documentType };
};

export const fileDeleteService = async (
  filename: string,
  documentType: string
) => {
  const fileExists = await File.findOne({
    name: filename,
    documentType,
  });

  if (!fileExists) {
    throw new HTTP_Error("No file found", NOT_FOUND);
  }

  const file = await File.findByIdAndDelete(fileExists._id);

  if (!file) {
    throw new HTTP_Error("Error deleting file", INTERNAL_SERVER_ERROR);
  }
  return file;
};
