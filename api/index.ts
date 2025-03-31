import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";

import cors from "cors";
import connectDB from "../src/config/db";
import { protect, routeAccess } from "../src/middleware/authMiddleware";
import { notFound, errorHandler } from "../src/middleware/errorMiddleware";
import departmentRoutes from "../src/routes/departmentRoutes";
import fileRoutes from "../src/routes/fileRoutes";
import userRoutes from "../src/routes/userRoutes";

connectDB();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use(
  "/api/departments",
  protect,
  routeAccess(["admin", "general"]),
  departmentRoutes
);
app.use("/api/files", protect, routeAccess(["general"]), fileRoutes);

app.use(notFound);
app.use(errorHandler as unknown as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
