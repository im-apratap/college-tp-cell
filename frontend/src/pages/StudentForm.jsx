import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import {
  Send,
  GraduationCap,
  User,
  Briefcase,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  BIHAR_ENGINEERING_COLLEGES,
  BRANCHES,
  BATCHES,
} from "../utils/constants";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "", // Added
    registrationNumber: "",
    email: "",
    fullContactNumber: "", // Renamed/Added
    whatsappContact: "", // Added
    alternateContact: "", // Added
    gender: "",
    dob: "",
    branch: "",
    collegeName: "",
    batch: "",
    currentCgpa: "",
    activeBacklogs: 0,
    percentage10th: "",
    school10th: "",
    board10th: "",
    percentage12th: "",
    institute12th: "",
    board12th: "",
    aadharNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const [submittedStudent, setSubmittedStudent] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strict Aadhar Validation: Only digits, max 12 chars
    if (name === "aadharNumber") {
      if (!/^\d*$/.test(value)) return; // Ignore non-digits
      if (value.length > 12) return; // Ignore if more than 12
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);
    if (value.length > 10) value = value.slice(0, 10);
    setFormData((prev) => ({ ...prev, dob: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = formData.dob.split("/");
      const isoDate = `${year}-${month}-${day}`;

      const payload = {
        ...formData,
        dob: isoDate,
        currentCgpa: formData.currentCgpa
          ? parseFloat(formData.currentCgpa)
          : null, // Allow validation to catch null if required, or handle gracefully
        activeBacklogs: formData.activeBacklogs
          ? parseInt(formData.activeBacklogs)
          : 0, // Default to 0 if empty
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/placement/submit`,
        payload,
      );

      setSubmittedStudent(response.data.data);
      toast.success("Application submitted successfully!");

      setFormData({
        fullName: "",
        fatherName: "",
        registrationNumber: "",
        email: "",
        fullContactNumber: "",
        whatsappContact: "",
        alternateContact: "",
        gender: "",
        dob: "",
        branch: "",
        collegeName: "",
        batch: "",
        currentCgpa: "",
        activeBacklogs: 0,
        percentage10th: "",
        school10th: "",
        board10th: "",
        percentage12th: "",
        institute12th: "",
        board12th: "",
        aadharNumber: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submittedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden print-area">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white relative">
            <div className="absolute top-4 right-4 print:hidden">
              <CheckCircle className="h-8 w-8 text-green-400 bg-white rounded-full" />
            </div>
            <div className="flex justify-center mb-3">
              <GraduationCap className="h-12 w-12 text-white opacity-90" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-wider">
              Nalanda College of Engineering
            </h1>
            <p className="text-sm font-medium opacity-80 mt-1">
              Placement Drive Admit Card
            </p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8 no-print">
              <h2 className="text-xl font-bold text-gray-900">
                Registration Successful!
              </h2>
              <p className="text-gray-500 mt-1">
                Please save this Admit Card. It contains your Unique ID required
                for entry.
              </p>
            </div>

            {/* Student Details Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 print:border-gray-800 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm font-bold text-gray-500 uppercase tracking-widest border border-gray-200 rounded-full shadow-sm">
                Candidate Details
              </div>

              <div className="grid grid-cols-2 gap-6 mt-2 text-left">
                <div className="col-span-2 text-center pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                    Unique Candidate ID
                  </p>
                  <p className="text-3xl font-mono font-black text-blue-700 mt-1 tracking-tight">
                    {submittedStudent.uniqueId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Full Name
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {submittedStudent.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Father's Name
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {submittedStudent.fatherName}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Registration No
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {submittedStudent.registrationNumber}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Date of Birth
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {new Date(submittedStudent.dob).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Father's Contact
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {submittedStudent.fullContactNumber}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    WhatsApp No
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {submittedStudent.whatsappContact}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Alternate No
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {submittedStudent.alternateContact}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Gender
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {submittedStudent.gender}
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    College
                  </p>
                  <p className="text-md font-medium text-gray-900 border-b border-gray-100 pb-1">
                    {BIHAR_ENGINEERING_COLLEGES.find(
                      (c) => c.value === submittedStudent.collegeName,
                    )?.label || submittedStudent.collegeName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Branch
                  </p>
                  <p className="text-base font-medium text-gray-800">
                    {BRANCHES.find((b) => b.value === submittedStudent.branch)
                      ?.label || submittedStudent.branch}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Batch
                  </p>
                  <p className="text-base font-medium text-gray-800">
                    {submittedStudent.batch}
                  </p>
                </div>

                <div className="col-span-2 pt-4 border-t border-gray-200 flex flex-col items-center justify-center">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 inline-block">
                    <QRCode
                      value={submittedStudent.uniqueId}
                      size={128}
                      level={"H"}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    Scan to Verify
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start text-left">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">
                  Important: Bring these documents (Original + Copies):
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Original Aadhar Card + 2 Photocopies</li>
                  <li>Original 10th Marksheet + 2 Photocopies</li>
                  <li>Original 12th/Diploma Marksheet + 2 Photocopies</li>
                  <li>2 Copies of Current Btech Marksheet</li>
                  <li>2 Copies of Resume</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 no-print">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-3"
              >
                <Send className="h-4 w-4 transform rotate-180" /> Print / Save
                PDF
              </Button>
              <Button
                variant="primary"
                onClick={() => setSubmittedStudent(null)}
                className="flex-1 py-3"
              >
                Submit Another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 relative">
          <div className="mb-8 text-center">
            <img
              src="/nce-logo.png"
              alt="nce-logo"
              className="mx-auto h-20 w-20 text-blue-600"
            />
            <button
              onClick={() => navigate("/admin/login")}
              className="absolute top-4 right-4 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors"
            >
              Admin Login
            </button>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Nalanda College of Engineering
            </h2>
            <h3 className="mt-2 text-2xl font-extrabold text-gray-900">
              Placement Coordination Form
            </h3>
            <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
              Please fill in your details accurately. This information will be
              used for upcoming placement drives.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" /> Personal Details
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />

                <Input
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Registration No."
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Email Id"
                />

                <Input
                  label="WhatsApp Number"
                  type="tel"
                  name="whatsappContact"
                  value={formData.whatsappContact}
                  onChange={handleChange}
                  required
                  placeholder="Enter WhatsApp No."
                />
                <Input
                  label="Alternate Number"
                  type="tel"
                  name="alternateContact"
                  value={formData.alternateContact}
                  onChange={handleChange}
                  required
                  placeholder="Enter Alternate No."
                />
                <Input
                  label="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder="Enter father's name"
                />
                <Input
                  label="Father's Contact Number"
                  type="tel"
                  name="fullContactNumber"
                  value={formData.fullContactNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter Father's Contact No."
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <Input
                  label="Date of Birth"
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleDobChange}
                  required
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                />
                <Input
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter 12-digit Aadhar No."
                  minLength={12}
                  maxLength={12}
                />
              </div>
            </div>

            {/* Academic Details */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gray-500" /> Academic
                Details
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <Select
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  options={BRANCHES}
                  placeholder="Select Branch"
                />
                <Select
                  label="College Name"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                  options={BIHAR_ENGINEERING_COLLEGES}
                  placeholder="Select College"
                />
                <Select
                  label="Batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  options={BATCHES}
                  placeholder="Select Batch"
                />
                <Input
                  label="Current CGPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="currentCgpa"
                  value={formData.currentCgpa}
                  onChange={handleChange}
                  required
                  placeholder="Enter Current CGPA (e.g. 8)"
                />
                <Input
                  label="Active Backlogs"
                  type="number"
                  min="0"
                  name="activeBacklogs"
                  value={formData.activeBacklogs}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Professional Details (Percentages) */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" /> Academic
                Performance
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="10th Percentage"
                    name="percentage10th"
                    value={formData.percentage10th}
                    onChange={handleChange}
                    required
                    placeholder="Enter 10th % (e.g. 95%)"
                  />
                  <Input
                    label="Enter 10th Institute Name"
                    name="school10th"
                    value={formData.school10th}
                    onChange={handleChange}
                    required
                    placeholder="Enter School Name"
                  />
                  <Input
                    label="Enter 10th Board Name"
                    name="board10th"
                    value={formData.board10th}
                    onChange={handleChange}
                    required
                    placeholder="Enter Board Name"
                  />
                  <Input
                    label="12th Percentage/ Diploma CGPA"
                    name="percentage12th"
                    value={formData.percentage12th}
                    onChange={handleChange}
                    required
                    placeholder="Enter 12th Percentage/ Diploma CGPA"
                  />
                  <Input
                    label="Enter 12th/ Diploma Institute Name"
                    name="institute12th"
                    value={formData.institute12th}
                    onChange={handleChange}
                    required
                    placeholder="Enter Institute Name"
                  />
                  <Input
                    label="Enter 12th/ Diploma Board Name"
                    name="board12th"
                    value={formData.board12th}
                    onChange={handleChange}
                    required
                    placeholder="Enter Board Name"
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1">Required Documents to Carry:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Original Aadhar Card + 2 Photocopies</li>
                  <li>Original 10th Marksheet + 2 Photocopies</li>
                  <li>Original 12th/Diploma Marksheet + 2 Photocopies</li>
                  <li>2 Copies of Current Btech Marksheet</li>
                  <li>2 Copies of Resume</li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentForm;
