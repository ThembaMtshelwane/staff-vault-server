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
import { routeAccess } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(
    routeAccess("admin"),
    validateMassDepartmentCreation,
    massDepartmentCreation
  )
  .get(routeAccess("admin", "general"), getDepartments);

router.get("/filter", routeAccess("admin", "general"), getFilteredDepartments);

router.post("/add", routeAccess("admin"), validateAddDepartment, addDepartment);
router
  .route("/:id")
  .get(validateModelID, routeAccess("general"), getDepartmentById)
  .put(
    routeAccess("admin"),
    validateModelID,
    validateUpdateDepartment,
    updateDepartment
  )
  .delete(routeAccess("admin"), validateModelID, deleteDepartment);

export default router;
