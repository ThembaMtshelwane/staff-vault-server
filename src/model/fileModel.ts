import mongoose, { Model, Schema } from "mongoose";
import { IFile } from "../detinitions";

const fileSchema: Schema<IFile> = new Schema(
  {
    name: { type: String, required: true },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    documentType: {
      type: String,
      default: "Other",
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
  },
  { timestamps: true }
);

const File: Model<IFile> = mongoose.model<IFile>("File", fileSchema);

export default File;
