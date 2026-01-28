import { StudentProfile } from "../models/start_application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";

import crypto from "crypto";

// Hardcoded deadline. ideally this should be in an env var
const PLACEMENT_DEADLINE = new Date("2026-01-27T21:00:00+05:30"); // Example deadline

const isFormOpen = () => {
  return new Date() < PLACEMENT_DEADLINE;
};

const getFormStatus = asyncHandler(async (req, res) => {
  const isOpen = isFormOpen();
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isOpen,
        message: isOpen ? "Applications are open" : "Applications are closed",
        deadline: PLACEMENT_DEADLINE,
      },
      "Form status fetched successfully",
    ),
  );
});

const submitProfile = asyncHandler(async (req, res) => {
  if (!isFormOpen()) {
    throw new ApiError(
      403,
      "Application submission is closed. Please contact the administrator.",
    );
  }

  try {
    const {
      fullName,
      fatherName,
      registrationNumber,
      email,
      fullContactNumber,
      whatsappContact,
      alternateContact,
      gender,
      dob,
      branch,
      collegeName,
      batch,
      currentCgpa,
      activeBacklogs,
      aadharNumber,
      percentage10th,
      school10th,
      board10th,
      percentage12th,
      institute12th,
      board12th,
      resumeLink,
      linkedinProfile,
      portfolioLink,
    } = req.body;

    // Basic validation
    if (
      [
        fullName,
        fatherName,
        registrationNumber,
        email,
        fullContactNumber,
        whatsappContact,
        alternateContact,
        gender,
        dob,
        collegeName,
        branch,
        batch,
        aadharNumber,
        percentage10th,
        school10th,
        board10th,
        percentage12th,
        institute12th,
        board12th,
      ].some((field) => typeof field === "string" && field?.trim() === "")
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }

    if (isNaN(currentCgpa)) {
      throw new ApiError(400, "Current CGPA must be a valid number");
    }

    // Check if profile already exists
    const existingProfiles = await StudentProfile.find({
      $or: [
        { registrationNumber: registrationNumber?.trim().toUpperCase() },
        { email: email?.trim().toLowerCase() },
        { aadharNumber: aadharNumber?.trim() },
      ],
    });

    if (existingProfiles.length > 1) {
      throw new ApiError(
        409,
        "Conflicting details found. The provided Email, Registration Number, or Aadhar Number belong to different existing student profiles. Please contact the administrator.",
      );
    }

    let profile = existingProfiles.length > 0 ? existingProfiles[0] : null;

    if (profile) {
      // Update existing profile
      profile.fullName = fullName;
      profile.fatherName = fatherName;
      profile.email = email;
      profile.fullContactNumber = fullContactNumber;
      profile.whatsappContact = whatsappContact;
      profile.alternateContact = alternateContact;
      profile.gender = gender;
      profile.dob = dob;
      profile.branch = branch;
      profile.collegeName = collegeName;
      profile.batch = batch;
      profile.currentCgpa = currentCgpa;
      profile.activeBacklogs = activeBacklogs || 0;
      profile.aadharNumber = aadharNumber;
      profile.percentage10th = percentage10th;
      profile.school10th = school10th;
      profile.board10th = board10th;
      profile.percentage12th = percentage12th;
      profile.institute12th = institute12th;
      profile.board12th = board12th;
      profile.resumeLink = resumeLink;
      profile.linkedinProfile = linkedinProfile;
      profile.portfolioLink = portfolioLink;

      // Send Email
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(to right, #2563eb, #4338ca); padding: 30px 20px; text-align: center; color: white;">
             <div style="display: inline-block; background-color: white; padding: 8px; border-radius: 50%; margin-bottom: 10px;">
                <!-- Simple icon representation -->
                <div style="width: 24px; height: 24px; background-color: #2563eb; border-radius: 50%;"></div>
             </div>
            <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Nalanda College of Engineering</h1>
            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Placement Drive Admit Card</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <p style="text-align: center; color: #4b5563; margin-bottom: 24px; font-size: 14px;">
              <strong>Registration Successful!</strong><br>
              Please save this Admit Card. It contains your Unique ID required for entry.
            </p>

            <!-- Card Container -->
            <div style="background-color: white; border: 2px dashed #d1d5db; border-radius: 12px; padding: 25px; position: relative;">
               <div style="text-align: center; margin-bottom: 4px;">
                 <span style="background-color: white; padding: 0 10px; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Candidate Details</span>
               </div>
               
              <!-- Unique ID Section -->
              <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
                <p style="text-transform: uppercase; font-size: 11px; color: #6b7280; font-weight: bold; margin: 0; letter-spacing: 0.5px;">Unique Candidate ID</p>
                <p style="font-family: monospace; font-size: 32px; font-weight: 900; color: #1d4ed8; margin: 8px 0 0; letter-spacing: -1px;">${profile.uniqueId}</p>
              </div>

              <!-- Details Grid -->
              <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Full Name</p>
                    <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${profile.fullName}</p>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Father's Name</p>
                    <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${profile.fatherName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Registration No</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.registrationNumber}</p>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Date of Birth</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${new Date(profile.dob).toISOString().split("T")[0].split("-").reverse().join("/")}</p>
                  </td>
                </tr>
                 <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Father's Contact</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.fullContactNumber}</p>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">WhatsApp No</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.whatsappContact}</p>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Alternate No</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.alternateContact}</p>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Gender</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.gender}</p>
                  </td>
                </tr>
                 <tr>
                  <td colspan="2" style="vertical-align: top; padding-top: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">College</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.collegeName}</p>
                  </td>
                </tr>
                 <tr>
                  <td style="width: 50%; vertical-align: top; padding-top: 10px; padding-right: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Branch</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151;">${profile.branch}</p>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-top: 10px; padding-left: 10px;">
                    <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Batch</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151;">${profile.batch}</p>
                  </td>
                </tr>
              </table>

                <!-- QR Code Section -->
               <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
                 <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">Click the button below to view your QR Code:</p>
                 <a href="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${profile.uniqueId}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                    View My QR Code
                 </a>
                 <p style="margin: 12px 0 0; font-family: monospace; font-size: 10px; color: #9ca3af;">Unique ID: ${profile.uniqueId}</p>
               </div>

            </div>

             <!-- Instructions -->
            <div style="margin-top: 25px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #1e40af; font-weight: bold;">Important: Bring these documents (Original + Copies):</p>
                 <ul style="margin: 8px 0 0; padding-left: 20px; color: #1e3a8a; font-size: 13px; line-height: 1.5;">
                  <li>Original Aadhar Card + 2 Photocopies</li>
                  <li>Original 10th Marksheet + 2 Photocopies</li>
                  <li>Original 12th/Diploma Marksheet + 2 Photocopies</li>
                  <li>2 Copies of Current Btech Marksheet</li>
                  <li>2 Copies of Resume</li>
                </ul>
            </div>
            
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Nalanda College of Engineering<br>
            <span style="font-size: 10px; color: #9ca3af;">Generated at: ${new Date().toLocaleString()}</span>
          </div>
        </div>
      `;

      await sendEmail({
        email: profile.email,
        subject: "NCE Placement Drive Registration Confirmation",
        html: emailHtml,
      });

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
      fatherName,
      registrationNumber,
      email,
      fullContactNumber,
      whatsappContact,
      alternateContact,
      gender,
      dob,
      branch,
      collegeName,
      batch,
      currentCgpa,
      activeBacklogs: activeBacklogs || 0,
      aadharNumber,
      percentage10th,
      school10th,
      board10th,
      percentage12th,
      institute12th,
      board12th,
      resumeLink,
      linkedinProfile,
      portfolioLink,
    });

    if (!profile) {
      throw new ApiError(
        500,
        "Something went wrong while creating the profile",
      );
    }

    // Generate QR Code

    // Send Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: white;">
        <!-- Header -->
        <div style="background: linear-gradient(to right, #2563eb, #4338ca); padding: 30px 20px; text-align: center; color: white;">
           <div style="display: inline-block; background-color: white; padding: 8px; border-radius: 50%; margin-bottom: 10px;">
              <!-- Simple icon representation -->
              <div style="width: 24px; height: 24px; background-color: #2563eb; border-radius: 50%;"></div>
           </div>
          <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Nalanda College of Engineering</h1>
          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Placement Drive Admit Card</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <p style="text-align: center; color: #4b5563; margin-bottom: 24px; font-size: 14px;">
            <strong>Registration Successful!</strong><br>
            Please save this Admit Card. It contains your Unique ID required for entry.
          </p>

          <!-- Card Container -->
          <div style="background-color: white; border: 2px dashed #d1d5db; border-radius: 12px; padding: 25px; position: relative;">
             <div style="text-align: center; margin-bottom: 4px;">
               <span style="background-color: white; padding: 0 10px; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Candidate Details</span>
             </div>
             
            <!-- Unique ID Section -->
            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
              <p style="text-transform: uppercase; font-size: 11px; color: #6b7280; font-weight: bold; margin: 0; letter-spacing: 0.5px;">Unique Candidate ID</p>
              <p style="font-family: monospace; font-size: 32px; font-weight: 900; color: #1d4ed8; margin: 8px 0 0; letter-spacing: -1px;">${profile.uniqueId}</p>
            </div>

            <!-- Details Grid -->
            <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Full Name</p>
                  <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${profile.fullName}</p>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Father's Name</p>
                  <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${profile.fatherName}</p>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Registration No</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.registrationNumber}</p>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Date of Birth</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${new Date(profile.dob).toISOString().split("T")[0].split("-").reverse().join("/")}</p>
                </td>
              </tr>
               <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Father's Contact</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.fullContactNumber}</p>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">WhatsApp No</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.whatsappContact}</p>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Alternate No</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.alternateContact}</p>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Gender</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.gender}</p>
                </td>
              </tr>
               <tr>
                <td colspan="2" style="vertical-align: top; padding-top: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">College</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">${profile.collegeName}</p>
                </td>
              </tr>
               <tr>
                <td style="width: 50%; vertical-align: top; padding-top: 10px; padding-right: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Branch</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151;">${profile.branch}</p>
                </td>
                <td style="width: 50%; vertical-align: top; padding-top: 10px; padding-left: 10px;">
                  <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Batch</p>
                  <p style="margin: 2px 0 0; font-size: 14px; font-weight: 500; color: #374151;">${profile.batch}</p>
                </td>
              </tr>
            </table>

             <!-- QR Code Section -->
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">Click the button below to view your QR Code:</p>
              <a href="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${profile.uniqueId}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                 View My QR Code
              </a>
              <p style="margin: 12px 0 0; font-family: monospace; font-size: 10px; color: #9ca3af;">Unique ID: ${profile.uniqueId}</p>
            </div>

          </div>

           <!-- Instructions -->
          <div style="margin-top: 25px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px; color: #1e40af; font-weight: bold;">Important: Bring these documents (Original + Copies):</p>
               <ul style="margin: 8px 0 0; padding-left: 20px; color: #1e3a8a; font-size: 13px; line-height: 1.5;">
                <li>Original Aadhar Card + 2 Photocopies</li>
                <li>Original 10th Marksheet + 2 Photocopies</li>
                <li>Original 12th/Diploma Marksheet + 2 Photocopies</li>
                <li>2 Copies of Current Btech Marksheet</li>
                <li>2 Copies of Resume</li>
              </ul>
          </div>
          
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Nalanda College of Engineering<br>
          <span style="font-size: 10px; color: #9ca3af;">Generated at: ${new Date().toLocaleString()}</span>
        </div>
      </div>
    `;

    await sendEmail({
      email: profile.email,
      subject: "NCE Placement Drive Registration Confirmation",
      html: emailHtml,
    });

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
      "Something went wrong while submitting the profile. Please check your inputs.",
    );
  }
});

// Get Profile by Registration Number
const getProfile = asyncHandler(async (req, res) => {
  const { registrationNumber } = req.params;

  if (!registrationNumber) {
    throw new ApiError(400, "Registration number is required");
  }

  const profile = await StudentProfile.findOne({ registrationNumber });

  if (!profile) {
    throw new ApiError(404, "Student profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

// Get Public Queue Status
const getQueueStatus = asyncHandler(async (req, res) => {
  const queue = await StudentProfile.find({
    interviewStatus: { $in: ["next", "in_interview"] },
    isPresent: true,
  })
    .select("fullName uniqueId interviewStatus branch batch")
    .sort({ updatedAt: 1 }); // FIFO for queue

  return res
    .status(200)
    .json(new ApiResponse(200, queue, "Queue status fetched successfully"));
});

// Update Queue Status (Admin only)
const updateQueueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "next", "in_interview", "completed"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const student = await StudentProfile.findByIdAndUpdate(
    id,
    { interviewStatus: status },
    { new: true },
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, student, "Student status updated successfully"));
});

export {
  submitProfile,
  getProfile,
  getFormStatus,
  getQueueStatus,
  updateQueueStatus,
};
