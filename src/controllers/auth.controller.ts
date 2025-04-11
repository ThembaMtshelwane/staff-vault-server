import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../model/userModel";
import generateAccessToken from "../utils/generateAccessToken";

import jwt from "jsonwebtoken";
import { IUser } from "../detinitions";

export const refreshAccessToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token found" });
    }

    // Decode without verification to get user ID
    const decoded = jwt.decode(refreshToken) as { id: string };

    if (!decoded || !decoded.id) {
      res.status(403).json({ message: "Invalid token structure" });
    }

    const user = (await User.findById(decoded.id)) as IUser;
    if (!user || !user.refresh_token_secret_key) {
      res.status(403).json({ message: "User not found or missing secret" });
    }

    try {
      jwt.verify(refreshToken, user?.refresh_token_secret_key as string);

      const newAccessToken = generateAccessToken(user);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      console.log("Refresh token error:", err);
      res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  }
);
