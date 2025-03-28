import express from "express";
import {
  addDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  getFilteredDepartments,
  massDepartmentCreation,
  updateDepartment,
} from "../controllers/departmentController";
import {
  validateAddDepartment,
  validateMassDepartmentCreation,
  validateUpdateDepartment,
} from "../middleware/validators/departmentValidator";
import { validateModelID } from "../middleware/validators/genericValidators";
import { protect, routeAccess } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    routeAccess("admin"),
    validateMassDepartmentCreation,
    massDepartmentCreation
  )
  .get(protect, routeAccess("admin", "general"), getDepartments);

router.get(
  "/filter",
  protect,
  routeAccess("admin", "general"),
  getFilteredDepartments
);

router.post(
  "/add",
  protect,
  routeAccess("admin"),
  validateAddDepartment,
  addDepartment
);
router
  .route("/:id")
  .get(validateModelID, protect, routeAccess("general"), getDepartmentById)
  .put(
    protect,
    routeAccess("admin"),
    validateModelID,
    validateUpdateDepartment,
    updateDepartment
  )
  .delete(protect, routeAccess("admin"), validateModelID, deleteDepartment);

export default router;
