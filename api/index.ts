import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "../src/config/db";
import cors from "cors";

import userRoutes from "../src/routes/userRoutes";
import departmentRoutes from "../src/routes/departmentRoutes";
import fileRoutes from "../src/routes/fileRoutes";
import { errorHandler, notFound } from "../src/middleware/errorMiddleware";
import { protect, routeAccess } from "../src/middleware/authMiddleware";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://staff-vault.vercel.app"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/departments", protect, departmentRoutes);
app.use("/api/files", protect, routeAccess(["general"]), fileRoutes);

app.use(notFound);
app.use(errorHandler as unknown as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
