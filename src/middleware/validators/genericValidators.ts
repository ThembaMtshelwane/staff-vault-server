import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "../../constants/http.codes";
import {
  fetchFilteredDocsSchema,
  objectIdSchema,
} from "../../schemas/genericSchema";

interface QueryParams extends Request {
  page?: string;
  search?: string;
  // department: string | null;
}

export const validateFetchFilteredDocs = expressAsyncHandler(
  async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const parsedQuery = fetchFilteredDocsSchema.safeParse({
      page: req.query.page,
      search: req.query.search,
      // department: req.query.department ?? null,
    });

    if (!parsedQuery.success) {
      res.status(BAD_REQUEST);
      return next(parsedQuery.error);
    }
    req.query.page = String(parsedQuery.data.page);
    req.query.search = parsedQuery.data.search;
    // req.query.department = parsedQuery.data.department;

    next();
  }
);

export const validateModelID = expressAsyncHandler(async (req, res, next) => {
  const result = objectIdSchema.safeParse(req.params.id);

  if (!result.success) {
    res.status(BAD_REQUEST);
    return next(result.error);
  }

  req.params.id = result.data as string;
  next();
});
