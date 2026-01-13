import { StudentProfile } from "../models/start_application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Submit or Update Profile
const submitProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    rollNumber,
    email,
    phone,
    branch,
    collegeName,
    batch,
    cgpa,
    activeBacklogs,
    aadharNumber,
    registrationNumber10th,
    registrationNumber12th,
    resumeLink,
    linkedinProfile,
    portfolioLink,
  } = req.body;

  // Basic validation
  if (
    [
      fullName,
      rollNumber,
      email,
      phone,
      collegeName,
      branch,
      batch,
      aadharNumber,
      registrationNumber10th,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if profile already exists
  let profile = await StudentProfile.findOne({
    $or: [{ rollNumber }, { email }, { aadharNumber }],
  });

  if (profile) {
    // Update existing profile
    profile.fullName = fullName;
    profile.phone = phone;
    profile.branch = branch;
    profile.collegeName = collegeName;
    profile.batch = batch;
    profile.cgpa = cgpa;
    profile.activeBacklogs = activeBacklogs;
    profile.aadharNumber = aadharNumber;
    profile.registrationNumber10th = registrationNumber10th;
    profile.registrationNumber12th = registrationNumber12th;
    profile.resumeLink = resumeLink;
    profile.linkedinProfile = linkedinProfile;
    profile.portfolioLink = portfolioLink;

    // Ensure rollNumber and email match/are not inadvertently swapped if checking logic changes
    // But since we query by them, we assume the user intends to update their own profile.
    // In a real app, we'd verify user ID from token. Here we trust the input for now or assume
    // checking logic holds.
    // For safety, let's just save.

    await profile.save();

    return res
      .status(200)
      .json(new ApiResponse(200, profile, "Profile updated successfully"));
  }

  // Create new profile
  const uniqueId =
    "NCE-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

  profile = await StudentProfile.create({
    uniqueId,
    fullName,
    rollNumber,
    email,
    phone,
    branch,
    collegeName,
    batch,
    cgpa,
    activeBacklogs,
    aadharNumber,
    registrationNumber10th,
    registrationNumber12th,
    resumeLink,
    linkedinProfile,
    portfolioLink,
  });

  if (!profile) {
    throw new ApiError(500, "Something went wrong while creating the profile");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, profile, "Profile submitted successfully"));
});

// Get Profile by Roll Number
const getProfile = asyncHandler(async (req, res) => {
  const { rollNumber } = req.params;

  if (!rollNumber) {
    throw new ApiError(400, "Roll number is required");
  }

  const profile = await StudentProfile.findOne({ rollNumber });

  if (!profile) {
    throw new ApiError(404, "Student profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

export { submitProfile, getProfile };
