import express from "express";
import {
  deleteUser,
  fetchAllUsers,
  fetchFilteredUsers,
  fetchUserById,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.route("/").get(fetchAllUsers);
router.get("/filter", fetchFilteredUsers);
// router.post("/admin", validateRegisterAdmin, createAdminUser);
// router.post("/login", validateLogin, loginUser);
// router.post("/logout", logoutUser);
// router.post("/add-user", protect, validateAddUser, addUser);
// router.get("/profile", protect, getUserProfile);
router.route("/:id").get(fetchUserById).delete(deleteUser).put(updateUser);

export default router;
