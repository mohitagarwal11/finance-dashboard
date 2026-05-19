import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    displayName: {
      type: String,
      trim: true,
    },
    expenseLimit: {
      type: Number,
      min: 0,
      default: 3000,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

// this password encrypting middleware(pre-hook?) runs just before saving of the user data
// or when password is modified
// DO NOT USE ARROW FUNCTION HERE AS IT DOES NOT HAVE ITS OWN CONTEXT
// DO NOT PASS OR RETURN next() HERE, AS IT DOESNT WORK FOR SOME REASON, JUST RETURN INSTEAD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// method to check for correct password using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// method to generate a new access token for user to access the api
// this expires faster than refresh token for security reasons
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

// method to generate a new refresh token for user to let user stay logged in for longer
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

// the db saves User as users but in raw code we use User for ref
export const User = mongoose.model("User", userSchema);
