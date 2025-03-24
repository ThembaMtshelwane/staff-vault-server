import express from "express";
import {
  addUser,
  deleteUser,
  fetchAllUsers,
  fetchFilteredUsers,
  fetchUserById,
  loginUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.route("/").get(fetchAllUsers);
router.get("/filter", fetchFilteredUsers);
// router.post("/admin", validateRegisterAdmin, createAdminUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);
router.post("/add-user", addUser);
// router.get("/profile", protect, getUserProfile);
router.route("/:id").get(fetchUserById).delete(deleteUser).put(updateUser);

export default router;
