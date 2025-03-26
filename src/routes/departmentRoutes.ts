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

const router = express.Router();

router.route("/").post(massDepartmentCreation).get(getDepartments);
router.get("/filter", getFilteredDepartments);
router.post("/add", addDepartment);
router
  .route("/:id")
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
