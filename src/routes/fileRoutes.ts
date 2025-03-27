import express from "express";
import dotenv from "dotenv";
import { upload } from "../config/db";
import { downloadFile, uploadFile } from "../controllers/fileContoller";
import {
  downloadValidator,
  uploadFileValidator,
} from "../middleware/validators/fileValidator";

dotenv.config();
const fileRoutes = express.Router();

fileRoutes.post(
  "/upload",
  upload.single("file"),
  uploadFileValidator,
  uploadFile
);

// Download endpoint
fileRoutes.get("/download/:filename", downloadValidator, downloadFile);

export default fileRoutes;
