import express from "express";
import dotenv from "dotenv";
import { upload } from "../config/db";
import { uploadFile } from "../controllers/fileContoller";
import { uploadFileValidator } from "../middleware/validators/fileValidator";

dotenv.config();
const fileRoutes = express.Router();

fileRoutes.post(
  "/upload",
  upload.single("file"),
  uploadFileValidator,
  uploadFile
);


export default fileRoutes;