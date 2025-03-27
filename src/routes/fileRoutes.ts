import express from "express";
import dotenv from "dotenv";
import { upload } from "../config/db";
import {
  deleteFile,
  downloadFile,
  getAllFiles,
  getFilteredFiles,
  uploadFile,
} from "../controllers/fileContoller";
import {
  deleteFileValidator,
  downloadValidator,
  uploadFileValidator,
} from "../middleware/validators/fileValidator";
import expressAsyncHandler from "express-async-handler";
import { fileDeleteService } from "../service/fileService";

dotenv.config();
const fileRoutes = express.Router();

fileRoutes.post(
  "/upload",
  upload.single("file"),
  uploadFileValidator,
  uploadFile
);

// Get all files endpoint
fileRoutes.get("/", getAllFiles);

// Download endpoint
fileRoutes.get("/download/:filename", downloadValidator, downloadFile);

// Get filtered files endpoint
fileRoutes.get("/filter", getFilteredFiles);

fileRoutes.delete("/:filename/:documentType", deleteFileValidator, deleteFile);

export default fileRoutes;
