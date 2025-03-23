import dotenv from "dotenv";
dotenv.config();
export const MONGO_URI: string = process.env.MONGO_URI as string;
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const USER_PASSWORD = process.env.USER_PASSWORD;
