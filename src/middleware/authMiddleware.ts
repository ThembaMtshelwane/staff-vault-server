import jwt, { JwtPayload } from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel";
import { JWT_SECRET } from "../constants/env.const";
import { NextFunction, Request, Response } from "express";
import { IUser, UserRole } from "../detinitions";
import HTTP_Error from "../utils/httpError";
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http.codes";

interface AuthRequest extends Request {
  user?: IUser;
}

interface IDecoded extends JwtPayload {
  id: unknown;
}

export const protect = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(new HTTP_Error("Not authorized, no token", UNAUTHORIZED));
    }
    const decoded = jwt.decode(accessToken) as IDecoded;

    if (!decoded || !decoded.id) {
      next(
        new HTTP_Error("Not authorized, invalid token structure", UNAUTHORIZED)
      );
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      next(new HTTP_Error("Not authorized, user not found", NOT_FOUND));
    }

    const currentJwtSecret = user?.jwt_secret;

    if (!currentJwtSecret) {
      next(
        new HTTP_Error(
          "Server error: User jwt_secret missing",
          INTERNAL_SERVER_ERROR
        )
      );
    }

    try {
      jwt.verify(accessToken, currentJwtSecret as string);
      req.user = user as IUser; // Attach user to request object
      next(); // Proceed to the next middleware or route handler
    } catch (verificationError) {
      return next(
        new HTTP_Error("Not authorized, invalid token", UNAUTHORIZED)
      );
    }
  }
);

export const routeAccess = (roles: UserRole[]) => {
  return expressAsyncHandler(
    (req: AuthRequest, res: Response, next: NextFunction) => {
      if (req.user && roles.includes(req.user.role)) {
        next();
      } else {
        next(new HTTP_Error("Forbidden to access this", FORBIDDEN));
      }
    }
  );
};
