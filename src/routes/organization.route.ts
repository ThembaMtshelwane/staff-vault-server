import express from "express";
import {
  addOrganization,
  getOrganizationByAdmin,
} from "../controllers/organisation.controller";

const organizationRoutes = express.Router();

organizationRoutes.post("/", addOrganization);
organizationRoutes.get("/:admin", getOrganizationByAdmin);

export default organizationRoutes;
