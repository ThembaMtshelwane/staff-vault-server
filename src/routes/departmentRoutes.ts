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

const router = express.Router();

router
  .route("/")
  .post(validateMassDepartmentCreation, massDepartmentCreation)
  .get(getDepartments);

router.get("/filter", getFilteredDepartments);

router.post("/add", validateAddDepartment, addDepartment);
router
  .route("/:id")
  .get(validateModelID, getDepartmentById)
  .put(validateModelID, validateUpdateDepartment, updateDepartment)
  .delete(validateModelID, deleteDepartment);

export default router;
