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
  access_token_secret_key: string;
  refresh_token_secret_key: string;
  refreshToken: string;
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

export interface IOrganization {
  name: string;
  description: string;
  registrationNumber: string;
  admin: string;
  address: string;
  phone: string;
  email: string;
}

export interface IOrganizationDocument extends IOrganization, Document {}
