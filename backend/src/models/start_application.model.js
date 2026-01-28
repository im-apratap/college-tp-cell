import mongoose, { Schema } from "mongoose";

const studentProfileSchema = new Schema(
  {
    // Personal Details
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
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
    whatsappContact: {
      type: String,
      required: true,
      trim: true,
    },
    alternateContact: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    dob: {
      type: Date,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullContactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Academic Details
    branch: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    currentCgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    activeBacklogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Professional Details
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 12-digit Aadhar number!`,
      },
    },
    percentage10th: {
      type: String,
      required: true,
      trim: true,
    },
    school10th: {
      type: String,
      required: true,
      trim: true,
    },
    board10th: {
      type: String,
      required: true,
      trim: true,
    },
    school10th: {
      type: String,
      required: true,
      trim: true,
    },
    board10th: {
      type: String,
      required: true,
      trim: true,
    },
    percentage12th: {
      type: String,
      required: true,
      trim: true,
    },
    institute12th: {
      type: String,
      required: true,
      trim: true,
    },
    board12th: {
      type: String,
      required: true,
      trim: true,
    },
    institute12th: {
      type: String,
      required: true,
      trim: true,
    },
    board12th: {
      type: String,
      required: true,
      trim: true,
    },
    resumeLink: {
      type: String,
      trim: true,
    },
    linkedinProfile: {
      type: String,
      trim: true,
    },
    portfolioLink: {
      type: String,
      trim: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    interviewStatus: {
      type: String,
      enum: ["pending", "next", "in_interview", "completed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema,
);
