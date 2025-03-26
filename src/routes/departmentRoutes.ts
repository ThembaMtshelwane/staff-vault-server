import express from "express";
import { massDepartmentCreation } from "../controllers/departmentController";

const router = express.Router();

router.route("/").post(massDepartmentCreation);
// .get(validateFetchAllDepartments, getDepartments);
// router.get("/filter", getFilteredDepartments);
// router.post("/add", validateAddDepartment, addDepartment);
// router
//   .route("/:id")
//   .get(validateDepartmentID, getDepartmentById)
//   .put(validateDepartmentID, validateUpdateDepartment, updateDepartment)
//   .delete(validateDepartmentID, deleteDepartment);

export default router;
