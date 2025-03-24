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
import { addUserService, loginService } from "../service/authService";
import { IUser } from "../detinitions";
import { ObjectId } from "mongoose";

export const fetchAllUsers = fetchDocs(User);
export const fetchFilteredUsers = fetchDocsByPagination(User);
export const fetchUserById = fetchOneDoc(User);
export const deleteUser = deleteOneDoc(User);
export const updateUser = updateOneDoc(User);

export const loginUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: IUser | null = await loginService(req.body);

    if (user) {
      generateToken(res, user._id as ObjectId);
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
