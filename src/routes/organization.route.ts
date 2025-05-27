import express from "express";
import { addOrganization } from "../controllers/organisation.controller";

const organizationRoutes = express.Router();

organizationRoutes.post("/", addOrganization);

export default organizationRoutes;
