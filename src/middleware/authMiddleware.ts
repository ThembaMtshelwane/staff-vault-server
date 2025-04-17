import jwt, { JwtPayload } from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel";
import { NextFunction, Request, Response } from "express";
import { IUser, UserRole } from "../detinitions";
import HTTP_Error from "../utils/httpError";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "../constants/http.codes";

interface AuthRequest extends Request {
  user?: IUser;
}

interface IDecoded extends JwtPayload {
  id: unknown;
}

export const protect = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    // console.log("accessToken   ", accessToken);
    // console.log("req.cookies   ", req.cookies, "\n");

    if (!accessToken) {
      // console.log("Not authorized, no token");
      return next(new HTTP_Error("Not authorized, no token", UNAUTHORIZED));
    }

    let decoded: IDecoded;

    try {
      decoded = jwt.decode(accessToken) as IDecoded;
      if (!decoded || !decoded.id) {
        // console.log("Invalid token structure");
        return next(new HTTP_Error("Invalid token structure", UNAUTHORIZED));
      }

      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.access_token_secret_key) {
        // console.log("Not authorized, user not found or secret missing");

        return next(
          new HTTP_Error(
            "Not authorized, user not found or secret missing",
            NOT_FOUND
          )
        );
      }

      jwt.verify(accessToken, user.access_token_secret_key);
      req.user = user;
      next();
    } catch (err) {
      // console.error("Token verification failed:", err);
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
