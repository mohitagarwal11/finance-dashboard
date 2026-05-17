import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// helps to determine if the user is even loggedin and authorize the access to the next function
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    // till here we found the token from frontend and decoded it
    // but we need to still check if the token is true or not in the db
    // so we try and find the user in the db with that decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // if we found the user then we can attach the user to the req object and call the next function
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
