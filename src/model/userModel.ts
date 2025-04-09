import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../detinitions";

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    position: { type: String, default: "" },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    supervisor: { type: Schema.Types.ObjectId, ref: "User", default: null },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
      default: process.env.USER_PASSWORD || "",
    },
    role: {
      type: String,
      emum: ["general", "admin", "super_admin"],
      default: "general",
    },
    permissions: { type: [String], default: [] },
    refreshToken: {
      type: String,
      default: null,
    },
    jwt_secret: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
export { userSchema };
