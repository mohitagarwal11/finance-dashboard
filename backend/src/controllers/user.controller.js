import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

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

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new ApiError(409, "User with username already exists");
    }

    if (existingUser.email === email) {
      throw new ApiError(409, "User with email already exists");
    }
  }

  // create user in db
  const user = await User.create({
    username,
    email,
    password,
  });

  // finds the created user and then removes password and refreshtoken from it
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken, refreshToken },
        "User registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // check is user exists
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    throw new ApiError(404, "User with given username does not exist");
  }

  // check if password is valid
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  // get access token and refresh token
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(existingUser);

  // finds the user and then removes password and refreshtoken from it
  const user = await User.findById(existingUser._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // removes the refresh token from db
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  // clears the access token and refresh token cookies from frontend and sends response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.body.refreshToken || req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user);

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: req.user }, "User fetched successfully"),
    );
});

const updateUserSettings = asyncHandler(async (req, res) => {
  const { displayName, expenseLimit } = req.body;
  const updates = {};

  if (displayName !== undefined) {
    if (typeof displayName !== "string") {
      throw new ApiError(400, "Display name must be a string");
    }

    updates.displayName = displayName.trim();
  }

  if (expenseLimit !== undefined) {
    const parsedExpenseLimit = Number(expenseLimit);

    if (!Number.isFinite(parsedExpenseLimit) || parsedExpenseLimit < 0) {
      throw new ApiError(400, "Expense limit must be a non-negative number");
    }

    updates.expenseLimit = parsedExpenseLimit;
  }

  if (!Object.keys(updates).length) {
    throw new ApiError(400, "No settings provided to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updates,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Settings updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserSettings,
};
