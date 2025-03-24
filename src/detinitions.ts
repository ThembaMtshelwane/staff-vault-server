import mongoose, { Document } from "mongoose";

type UserRole = "general" | "admin" | "manager";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  position: string;
  department?: mongoose.Types.ObjectId | null;
  supervisor?: mongoose.Types.ObjectId | null;
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}
