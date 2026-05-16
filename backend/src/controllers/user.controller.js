import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

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

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
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

  const options = {
    secure: true,
    httpOnly: true,
  };

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
          user: user,
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

  const options = {
    secure: true,
    httpOnly: true,
  };
  // clears the access token and refresh token cookies from frontend and sends response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
