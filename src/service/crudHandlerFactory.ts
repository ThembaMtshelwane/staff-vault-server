import expressAsyncHandler from "express-async-handler";
import HTTP_Error from "../utils/httpError";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/http.codes";

export const fetchDocs = (Model: any) =>
  expressAsyncHandler(async (req, res) => {
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
