import asyncHandler from "express-async-handler";
import { INTERNAL_SERVER_ERROR } from "../constants/http.codes";
import HTTP_Error from "../utils/httpError";
import { massDepartmentCreationService } from "../service/departmnetService";

/**
 *  @description Create all of the organization's department
 *  @route POST /api/departments
 *  @access PRIVATE
 */
export const massDepartmentCreation = asyncHandler(async (req, res) => {
  const { departmentsList } = req.body;
  const { data, message } = await massDepartmentCreationService(
    departmentsList
  );

  if (data) {
    res.status(201).json({
      success: true,
      message,
    });
  } else {
    throw new HTTP_Error(
      "Failed to create all departments",
      INTERNAL_SERVER_ERROR
    );
  }
});
