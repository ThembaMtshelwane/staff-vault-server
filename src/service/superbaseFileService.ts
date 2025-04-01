import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import HTTP_Error from "../utils/httpError";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http.codes";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/superbaseClient";
import { FileMetadata, IUser } from "../detinitions";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "files";
const FILES_TABLE = "files_metadata";

/**
 * Uploads a file to Supabase Storage and stores its metadata.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

export interface AuthRequest extends Request {
  user?: IUser;
}

export const uploadFile = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new HTTP_Error("No file uploaded", 400);
    }

    const { originalname, buffer, mimetype } = req.file;
    const { documentType, ...metadata } = req.body;
    const fileId = uuidv4();
    // const filename = `${fileId}-${originalname}`; // Generate unique filename
    const filePath = `${documentType}/${originalname}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mimetype,
      });

    if (uploadError) {
      throw new HTTP_Error(`File upload failed: ${uploadError.message}`, 500);
    }

    const fileMetadata: FileMetadata = {
      id: fileId,
      filename: originalname,
      documentType,
      path: filePath,
      uploadedAt: new Date().toISOString(),
      userId: req.user?.id,
    };

    const { error: dbError } = await supabase
      .from(FILES_TABLE)
      .insert([fileMetadata]);

    if (dbError) {
      // If db insert fails, delete the file from storage to maintain consistency
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw new HTTP_Error(
        `Database insertion failed: ${dbError.message}`,
        500
      );
    }

    res.status(201).json({
      success: true,
      message: "File Uploaded Successfully",
      data: fileMetadata,
    });
  }
);

/**
 * Downloads a file from Supabase Storage by its filename.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const downloadFile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;

    const { data: fileMetadata, error: metadataError } = await supabase
      .from(FILES_TABLE)
      .select("*")
      .eq("filename", filename)
      .single();

    if (metadataError || !fileMetadata) {
      throw new HTTP_Error("File metadata not found", NOT_FOUND);
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(fileMetadata.path);

    if (downloadError || !fileData) {
      throw new HTTP_Error("File not found in storage", NOT_FOUND);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileMetadata.filename}`
    );
    res.send(Buffer.from(await fileData.arrayBuffer()));
  }
);

/**
 * Retrieves all files from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getAllFiles = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { data, error } = await supabase.from(FILES_TABLE).select("*");

    if (error) {
      throw new HTTP_Error(`Failed to fetch files: ${error.message}`, 500);
    }
    res.status(200).json({
      success: true,
      message: `${data.length} files returned`,
      data: data,
    });
  }
);

export const getFilteredFiles = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const documentType = req.query.documentType as string;

    if (!documentType) {
      throw new HTTP_Error(`documentType is required`, INTERNAL_SERVER_ERROR);
    }

    const { data: files, error } = (await supabase
      .from(FILES_TABLE)
      .select("*")
      .eq("documentType", documentType)) as {
      data: FileMetadata[];
      error: any;
    };

    if (error) {
      throw new HTTP_Error(
        `Failed to fetch filtered files: ${error.message}`,
        INTERNAL_SERVER_ERROR
      );
    }

    if (!files || files.length === 0) {
      res.status(OK).json({
        success: true,
        message: `No ${documentType} files found`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `${files.length} ${documentType} files returned`,
      data: files,
    });
  }
);

export const deleteFile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const documentType = req.params.documentType;

    const { data: fileMetadata, error: metadataError } = await supabase
      .from(FILES_TABLE)
      .select("*")
      .eq("filename", filename)
      .eq("documentType", documentType)
      .single();

    if (metadataError || !fileMetadata) {
      throw new HTTP_Error("File metadata not found", NOT_FOUND);
    }

    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileMetadata.path]);

    if (storageError) {
      throw new HTTP_Error(
        `Failed to delete file from storage: ${storageError.message}`,
        500
      );
    }

    const { error: dbError } = await supabase
      .from(FILES_TABLE)
      .delete()
      .eq("id", fileMetadata.id);

    if (dbError) {
      throw new HTTP_Error(
        `Failed to delete file metadata: ${dbError.message}`,
        500
      );
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: fileMetadata,
    });
  }
);
