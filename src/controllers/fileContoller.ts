import expressAsyncHandler from "express-async-handler";
import { fetchDocs } from "../service/crudHandlerFactory";
import {
  fileDeleteService,
  fileDownloadService,
  fileUploadService,
  getFilteredFilesService,
} from "../service/fileService";
import { NextFunction, Request, Response } from "express";
import HTTP_Error from "../utils/httpError";
import { NOT_FOUND } from "../constants/http.codes";
import File from "../model/fileModel";

/**
 * Uploads a file to GridFS and stores its metadata.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const uploadFile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const uploaded = await fileUploadService(req.file, req.body);

    res.status(201).json({
      success: true,
      message: "File Uploaded Successfully",
      data: uploaded,
    });
  }
);

/**
 * Downloads a file from GridFS by its filename.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const downloadFile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullPath, filename } = await fileDownloadService(
      req.params.filename
    );

    if (!fullPath || !filename) {
      res.status(404);
      throw new HTTP_Error("File not found", NOT_FOUND);
    }

    res.download(fullPath, filename);
  }
);

/**
 * Retrieves all files from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getAllFiles = fetchDocs(File);

export const getFilteredFiles = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { files, documentType } = await getFilteredFilesService(
      req.query.documentType as string
    );
    res.status(200).json({
      success: true,
      message: `${files.length} ${documentType} files returned`,
      data: files,
    });
  }
);

export const deleteFile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const file = await fileDeleteService(
      req.params.filename,
      req.params.documentType
    );
    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: file,
    });
  }
);
