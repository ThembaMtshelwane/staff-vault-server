import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../model/userModel";
import generateAccessToken from "../utils/generateAccessToken";

import jwt from "jsonwebtoken";
import { IUser } from "../detinitions";
import HTTP_Error from "../utils/httpError";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/http.codes";
import { setAccessTokenCookies } from "../utils/generateToken";

export const refreshAccessToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    console.log("ACTIVATED refreshAccessToken FUNCTION");

    if (!refreshToken) {
      throw new HTTP_Error("No refresh token found", UNAUTHORIZED);
    }

    const decoded = jwt.decode(refreshToken) as { id: string };

    if (!decoded || !decoded.id) {
      throw new HTTP_Error("Invalid token structure", FORBIDDEN);
    }

    const user = (await User.findById(decoded.id)) as IUser;
    console.log("user  ", user);

    if (!user || !user.refresh_token_secret_key) {
      throw new HTTP_Error("User not found or missing secret", FORBIDDEN);
    }

    try {
      jwt.verify(refreshToken, user?.refresh_token_secret_key as string);

      const newAccessToken = generateAccessToken(user);
      setAccessTokenCookies(res, newAccessToken);

      res.status(200).json({
        message: "New access token generated",
        success: true,
        data: user,
      });
    } catch (err) {
      console.log("Refresh token error:", err);
      throw new HTTP_Error("Invalid or expired refresh token", FORBIDDEN);
    }
  }
);
