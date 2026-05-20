import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong when generating access and refresh token",
    );
  }
};

export const firebaseUserAuth = asyncHandler(async (req, res) => {
  const firebaseUser = req.firebaseUser;
  // console.log("Firebase user info:", firebaseUser);

  let user = await User.findOne({ firebaseUid: firebaseUser.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,

      username: req.body.username || firebaseUser.name || "user",
    });
  }
  // console.log("Authenticated user:", user);

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});
