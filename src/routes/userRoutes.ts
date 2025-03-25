import express from "express";
import {
  addUser,
  createAdminUser,
  deleteUser,
  fetchAllUsers,
  fetchFilteredUsers,
  fetchUserById,
  loginUser,
  logoutUser,
  registerAllUsers,
  updateUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(protect, fetchAllUsers).post(protect, registerAllUsers);
router.get("/filter", protect, fetchFilteredUsers);
router.post("/admin", protect, createAdminUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/add-user", protect, addUser);
// router.get("/profile", protect, getUserProfile);
router
  .route("/:id")
  .get(protect, fetchUserById)
  .delete(protect, deleteUser)
  .put(protect, updateUser);

export default router;
