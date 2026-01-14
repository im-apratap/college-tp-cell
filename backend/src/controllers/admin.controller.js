import { Admin } from "../models/admin.model.js";
import { StudentProfile } from "../models/start_application.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper to generate access token
const generateAccessLink = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin with email or username already exists");
  }

  const admin = await Admin.create({
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdAdmin = await Admin.findById(admin._id).select("-password");

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken } = await generateAccessLink(user._id);

  const loggedInUser = await Admin.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "Admin logged In Successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

const getAllStudentProfiles = asyncHandler(async (req, res) => {
  const students = await StudentProfile.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});

const deleteStudentProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Student ID is required");
  }

  const deletedStudent = await StudentProfile.findByIdAndDelete(id);

  if (!deletedStudent) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Student profile deleted successfully"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Admin fetched successfully"));
});

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAllStudentProfiles,
  deleteStudentProfile,
  getCurrentAdmin,
};
