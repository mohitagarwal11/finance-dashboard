import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Transaction } from "../models/transaction.models.js";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";
const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
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

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.body.refreshToken || req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

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

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: req.user }, "User fetched successfully"),
    );
});

export const updateUserSettings = asyncHandler(async (req, res) => {
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

export const deleteCurrentUser = asyncHandler(async (req, res) => {
  await Transaction.deleteMany({ user: req.user._id });

  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "Account deleted successfully"));
});
