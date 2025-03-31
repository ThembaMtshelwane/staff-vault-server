import mongoose, { Document } from "mongoose";

export type UserRole = "general" | "admin" | "super_admin";

export interface IUser extends Document {
  // _id: mongoose.Schema.Types.ObjectId;
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

export interface IDepartment extends Document {
  name: string;
  positions: string[];
  supervisor: mongoose.Schema.Types.ObjectId;
}

export interface IFile extends Document {
  documentType: string;
  employee: mongoose.Schema.Types.ObjectId | string | null;
  mimetype: string;
  name: string;
  path: string;
}

export interface FileMetadata {
  id: string;
  filename: string;
  documentType: string;
  path: string;
  uploadedAt: string;
  metadata?: any;
  userId: string;
}
