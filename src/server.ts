import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";

import userRoutes from "./routes/userRoutes";

connectDB();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
