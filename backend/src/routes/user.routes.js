import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserSettings,
  deleteCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

router
  .route("/me")
  .get(verifyJWT, getCurrentUser)
  .delete(verifyJWT, deleteCurrentUser);

router.route("/settings").patch(verifyJWT, updateUserSettings);

export default router;
