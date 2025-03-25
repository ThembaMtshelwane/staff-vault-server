import mongoose, { Document } from "mongoose";

export type UserRole = "general" | "admin" | "super_admin";

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

export interface IDepartmentBasicInfo {
  name: string;
  positions: string[];
}
