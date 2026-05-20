import admin from "../config/firebaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

export const verifyFirebase = asyncHandler(async (req, res, next) => {
  try {
    const firebaseToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!firebaseToken) {
      return next(new ApiError(401, "Unauthorized request: No token provided"));
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    // console.log("Decoded Firebase token:", decodedToken);

    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Firebase token");
  }
});
