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
  getUserProfile,
} from "../controllers/userController";
import { protect, routeAccess } from "../middleware/authMiddleware";
import {
  validateLogin,
  validateRegisterAdmin,
  validateRegisterAllUsers,
} from "../middleware/validators/authValidator";
import { validateAddUser } from "../middleware/validators/userValidator";
import {
  validateFetchFilteredDocs,
  validateModelID,
} from "../middleware/validators/genericValidators";

const router = express.Router();

router
  .route("/")
  .get(protect, routeAccess(["admin", "general"]), fetchAllUsers)
  .post(
    protect,
    routeAccess(["admin", "super_admin"]),
    validateRegisterAllUsers,
    registerAllUsers
  );
router.get(
  "/filter",
  protect,
  routeAccess(["admin", "general"]),
  // validateFetchFilteredDocs,
  fetchFilteredUsers
);
router.post(
  "/admin",
  // protect,
  // routeAccess(["super_admin"]),
  validateRegisterAdmin,
  createAdminUser
);

router.post("/login", validateLogin, loginUser);
router.post(
  "/logout",
  // routeAccess(["admin", "general", "super_admin"]),
  logoutUser
);

router.post(
  "/add-user",
  protect,
  routeAccess(["admin"]),
  validateAddUser,
  addUser
);
router.get("/profile", protect, getUserProfile);
router
  .route("/:id")
  .get(
    protect,
    routeAccess(["admin", "general"]),
    validateModelID,
    fetchUserById
  )
  .delete(protect, routeAccess(["admin"]), validateModelID, deleteUser)
  .put(protect, routeAccess(["general"]), validateModelID, updateUser);

export default router;
