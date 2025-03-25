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
import { protect, routeAcess } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(protect, routeAcess(["admin", "general"]), fetchAllUsers)
  .post(protect, routeAcess(["admin", "super_admin"]), registerAllUsers);
router.get(
  "/filter",
  protect,
  routeAcess(["admin", "general"]),
  fetchFilteredUsers
);
router.post("/admin", routeAcess(["super_admin"]), createAdminUser);
router.post("/login", loginUser);
router.post(
  "/logout",
  protect,
  routeAcess(["admin", "general", "super_admin"]),
  logoutUser
);
router.post("/add-user", protect, routeAcess(["admin"]), addUser);
// router.get("/profile", protect, getUserProfile);
router
  .route("/:id")
  .get(protect, routeAcess(["admin", "general"]), fetchUserById)
  .delete(protect, routeAcess(["admin"]), deleteUser)
  .put(protect, routeAcess(["general"]), updateUser);

export default router;
