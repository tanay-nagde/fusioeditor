// controllers/user.controller.js

import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

// Token generator
const generateAccessandReadAccessToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, 'User registered successfully')
  );
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, 'Email or username required');
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Incorrect password');
  }

  const { accessToken, refreshToken } = await generateAccessandReadAccessToken(user._id);
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'User logged in successfully'));
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: null }
  });

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .status(200)
    .json(new ApiResponse(200, null, 'User logged out successfully'));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, 'Unauthorized access - no refresh token');
  }

  const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id);

  if (!user || incomingToken !== user.refreshToken) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateAccessandReadAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    return res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
  });
  

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser
};
