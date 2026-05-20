import { Router } from "express";
import {
  getCurrentUser,
  updateUserSettings,
  deleteCurrentUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/refreshToken").post(refreshAccessToken);

router.use(verifyJWT);

router.route("/logout").post(logoutUser);

router.route("/me").get(getCurrentUser).delete(deleteCurrentUser);

router.route("/settings").patch(updateUserSettings);

export default router;
