import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import HTTP_Error from "../utils/httpError";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../constants/http.codes";
import mongoose from "mongoose";

export const fetchDocs = (Model: any) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const documents = await Model.find({});

    if (!documents) {
      throw new HTTP_Error("Internal Server error", INTERNAL_SERVER_ERROR);
    }

    if (documents.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${documents.length} ${Model.modelName}s`,
        data: documents,
      });
    } else {
      throw new HTTP_Error(`No  ${Model.modelName}s found`, NOT_FOUND);
    }
  });

export const fetchDocsByPagination = (Model: any) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const search = req.query.search || "";
    const department = req.query.department as string;
    const limit = 12;
    const skip = (page - 1) * limit;
    let filter: any = {};

    if (department) {
      if (!mongoose.Types.ObjectId.isValid(department)) {
        throw new HTTP_Error(`Invalid ${Model.modelName} id`, BAD_REQUEST);
      }
      (filter as any).department = new mongoose.Types.ObjectId(department);
    }

    if (search) {
      (filter as any).$or = [
        { firstName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }

    const documents = await Model.find(filter).skip(skip).limit(limit);
    const totalDocuments = await Model.countDocuments(filter);

    if (documents.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${documents.length} ${Model.modelName}s `,
        data: documents,
        pagination: {
          totalDocuments,
          currentPage: page,
          totalPages: Math.ceil(totalDocuments / limit),
          pageSize: limit,
        },
      });
    } else {
      throw new HTTP_Error(`No ${Model.modelName}s  found`, NOT_FOUND);
    }
  });

export const fetchOneDoc = (Model: any) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const foundDocument = await Model.findById(req.params.id);

    if (!foundDocument)
      throw new HTTP_Error("No document found with that ID", NOT_FOUND);

    res.status(200).json({
      success: true,
      message: `Retrieved ${Model.modelName}`,
      data: foundDocument,
    });
  });

export const deleteOneDoc = (Model: any) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const removedDocument = await Model.findByIdAndDelete(req.params.id);
    if (!removedDocument)
      throw new HTTP_Error("No document found with that ID", NOT_FOUND);

    res.status(OK).json({
      success: true,
      message: `${Model.modelName} deleted successfully`,
    });
  });

export const updateOneDoc = (Model: any) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      throw new HTTP_Error("No document found with that ID", NOT_FOUND);
    }

    res.status(OK).json({
      success: true,
      message: `${Model.modelName} updated successfully`,
      data: updatedDoc,
    });
  });
