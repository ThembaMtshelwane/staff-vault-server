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
import { validateMassDepartmentCreation } from "../middleware/validators/departmentValidator";

const router = express.Router();

router
  .route("/")
  .post(validateMassDepartmentCreation, massDepartmentCreation)
  .get(getDepartments);
router.get("/filter", getFilteredDepartments);
router.post("/add", addDepartment);
router
  .route("/:id")
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
