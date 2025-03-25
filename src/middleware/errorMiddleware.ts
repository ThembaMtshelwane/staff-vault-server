import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../constants/env.const";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/http.codes";
import HTTP_Error from "../utils/httpError";
import { ZodError } from "zod";

/*
    @desc: For routes not found
*/
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new HTTP_Error(`Not Found - ${req.originalUrl}`, NOT_FOUND);
  next(error);
};

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: BAD_REQUEST,
    body: {
      success: false,
      errors,
      message: "Validation Error",
    },
  };
};

/*
    @desc:Global error-handling middleware
*/

const errorHandler = (
  err: any | Error | ZodError | HTTP_Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("*************************** caught error :,", err);

  //   if (err.name === "CastError" && err.kind === "ObjectId") {
  //     statusCode = 404;
  //     message = "Resource Not Found";
  //   }

  if (err instanceof HTTP_Error) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: NODE_ENV === "development" ? err.stack : null,
    });
  }

  if (err instanceof ZodError) {
    const { statusCode, body } = handleZodError(err);
    res.status(statusCode).json(body);
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      "Serious server error, something went terribly wrong, call for help!",
    stack: NODE_ENV === "development" ? err.stack : null,
  });

  next();
};

export { notFound, errorHandler };
