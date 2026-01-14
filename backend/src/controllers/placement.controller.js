import { StudentProfile } from "../models/start_application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";

const submitProfile = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      rollNumber,
      email,
      phone,
      branch,
      collegeName,
      batch,
      currentCgpa,
      activeBacklogs,
      aadharNumber,
      percentage10th,
      percentage12th,
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
        percentage10th,
        percentage12th,
      ].some((field) => typeof field === "string" && field?.trim() === "")
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }

    if (isNaN(currentCgpa)) {
      throw new ApiError(400, "Current CGPA must be a valid number");
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
      profile.currentCgpa = currentCgpa;
      profile.activeBacklogs = activeBacklogs || 0;
      profile.aadharNumber = aadharNumber;
      profile.percentage10th = percentage10th;
      profile.percentage12th = percentage12th;
      profile.resumeLink = resumeLink;
      profile.linkedinProfile = linkedinProfile;
      profile.portfolioLink = portfolioLink;

      await profile.save();

      return res
        .status(200)
        .json(new ApiResponse(200, profile, "Profile updated successfully"));
    }

    // Create new profile
    const uniqueId =
      "NCE-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    profile = await StudentProfile.create({
      uniqueId,
      fullName,
      rollNumber,
      email,
      phone,
      branch,
      collegeName,
      batch,
      currentCgpa,
      activeBacklogs: activeBacklogs || 0,
      aadharNumber,
      percentage10th,
      percentage12th,
      resumeLink,
      linkedinProfile,
      portfolioLink,
    });

    if (!profile) {
      throw new ApiError(
        500,
        "Something went wrong while creating the profile"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, profile, "Profile submitted successfully"));
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      throw new ApiError(409, `A student with this ${field} already exists.`);
    }
    // Re-throw known ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }
    // Improve default error logging
    console.error("Profile Submission Error:", error);
    throw new ApiError(
      500,
      "Something went wrong while submitting the profile. Please check your inputs."
    );
  }
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
