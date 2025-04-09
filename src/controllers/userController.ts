import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel";
import { Request, Response } from "express";

import {
  deleteOneDoc,
  fetchDocs,
  fetchDocsByPagination,
  fetchOneDoc,
  updateOneDoc,
} from "../service/crudHandlerFactory";
import HTTP_Error from "../utils/httpError";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "../constants/http.codes";
import generateToken from "../utils/generateToken";
import {
  addUserService,
  loginService,
  massStaffRegistrationService,
} from "../service/authService";
import { IUser } from "../detinitions";
import { ObjectId } from "mongoose";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const fetchAllUsers = fetchDocs(User);
export const fetchFilteredUsers = fetchDocsByPagination(User);
export const fetchUserById = fetchOneDoc(User);
export const deleteUser = deleteOneDoc(User);
export const updateUser = updateOneDoc(User);

export const loginUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: IUser | null = await loginService(req.body);

    if (user) {
      await generateToken(res, user);
      res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: user,
      });
    } else {
      throw new HTTP_Error("Invalid email or password", UNAUTHORIZED);
    }
  }
);

export const addUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: IUser = await addUserService(req.body);
    if (!user) {
      throw new HTTP_Error("Failed to create user", INTERNAL_SERVER_ERROR);
    }
    res.status(201).json({
      success: true,
      message: `Successfully created a user`,
    });
  }
);

export const registerAllUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const staffEmails: string[] = req.body.staffEmails;
    const { data, message } = await massStaffRegistrationService(
      staffEmails,
      res
    );

    if (data) {
      res.status(201).json({
        success: true,
        message,
      });
    } else {
      throw new HTTP_Error("Failed to create all users", INTERNAL_SERVER_ERROR);
    }
  }
);

export const createAdminUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await addUserService({ ...req.body, role: "admin" });
    if (!user) {
      throw new HTTP_Error("Failed to create admin", INTERNAL_SERVER_ERROR);
    }
    res.status(201).json({
      success: true,
      message: `Successfully created an admin`,
      data: user,
    });
  }
);

export const logoutUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "User logged out",
    });
  }
);

export const getUserProfile = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
      throw new HTTP_Error("Not authorized, user not found", UNAUTHORIZED);
    }
    const user = {
      _id: (req.user._id as ObjectId).toString(),
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      position: req.user.position || "",
      role: req.user.role,
      permissions: req.user.permissions || [],
      department: req.user.department ? req.user.department.toString() : null,
      supervisor: req.user.supervisor ? req.user.supervisor.toString() : null,
    };

    res.status(200).json({
      success: true,
      message: "Logged in user data returned",
      data: user,
    });
  }
);
