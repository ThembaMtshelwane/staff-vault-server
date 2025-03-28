import mongoose, { Schema, Model } from "mongoose";
import { IDepartment } from "../detinitions";

const departmentSchema: Schema<IDepartment> = new Schema(
  {
    name: { type: String, required: true },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    positions: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Department: Model<IDepartment> = mongoose.model<IDepartment>(
  "Department",
  departmentSchema
);

export default Department;
export { departmentSchema };
