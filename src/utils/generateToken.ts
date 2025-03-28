import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../constants/env.const";
import { Response } from "express";
import mongoose from "mongoose";

//TODO: update to add refresh token
const generateToken = (
  res: Response,
  userID: mongoose.Schema.Types.ObjectId
) => {
  const token = jwt.sign({ userID }, JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== " development",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
