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
  getUserProfile
} from "../controllers/userController";
import { protect, routeAcess } from "../middleware/authMiddleware";
import {
  validateRegisterAdmin,
  validateRegisterAllUsers,
} from "../middleware/validators/authValidator";
import {
  validateAddUser,
  validateFetchFilteredUsers,
  validateId,
} from "../middleware/validators/userValidator";

const router = express.Router();

router
  .route("/")
  .get(protect, routeAcess(["admin", "general"]), fetchAllUsers)
  .post(
    protect,
    routeAcess(["admin", "super_admin"]),
    validateRegisterAllUsers,
    registerAllUsers
  );
router.get(
  "/filter",
  protect,
  routeAcess(["admin", "general"]),
  validateFetchFilteredUsers,
  fetchFilteredUsers
);
router.post(
  "/admin",
  protect,
  routeAcess(["super_admin"]),
  validateRegisterAdmin,
  createAdminUser
);
router.post("/login", loginUser);
router.post(
  "/logout",
  protect,
  routeAcess(["admin", "general", "super_admin"]),
  logoutUser
);
router.post(
  "/add-user",
  protect,
  routeAcess(["admin"]),
  validateAddUser,
  addUser
);
router.get("/profile", protect, getUserProfile);
router
  .route("/:id")
  .get(protect, validateId, routeAcess(["admin", "general"]), fetchUserById)
  .delete(protect, validateId, routeAcess(["admin"]), deleteUser)
  .put(protect, validateId, routeAcess(["general"]), updateUser);

export default router;
