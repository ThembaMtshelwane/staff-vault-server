import jwt, { JwtPayload } from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel";
import { JWT_SECRET } from "../constants/env.const";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../detinitions";
import HTTP_Error from "../utils/httpError";
import { NOT_FOUND, UNAUTHORIZED } from "../constants/http.codes";

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      throw new HTTP_Error("Not authorized, no token", UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      const user = await User.findById(decoded.userID).select("-password");

      if (!user) {
        throw new HTTP_Error("Not authorized, user not found", NOT_FOUND);
      }

      req.user = user;
      next();
    } catch (error) {
      throw new HTTP_Error("Not authorized, invalid token", UNAUTHORIZED);
    }
  }
);
