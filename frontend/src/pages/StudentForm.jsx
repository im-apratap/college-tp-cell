import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  Send,
  GraduationCap,
  User,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    phone: "",
    branch: "",
    collegeName: "",
    batch: "",
    currentCgpa: "",
    activeBacklogs: 0,
    percentage10th: "",
    percentage12th: "",
    aadharNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const [submittedStudent, setSubmittedStudent] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        currentCgpa: formData.currentCgpa
          ? parseFloat(formData.currentCgpa)
          : null, // Allow validation to catch null if required, or handle gracefully
        activeBacklogs: formData.activeBacklogs
          ? parseInt(formData.activeBacklogs)
          : 0, // Default to 0 if empty
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/placement/submit`,
        payload
      );

      setSubmittedStudent(response.data.data);
      toast.success("Application submitted successfully!");

      setFormData({
        fullName: "",
        rollNumber: "",
        email: "",
        phone: "",
        branch: "",
        collegeName: "",
        batch: "",
        currentCgpa: "",
        activeBacklogs: 0,
        percentage10th: "",
        percentage12th: "",
        aadharNumber: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
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
                    Roll Number
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {submittedStudent.rollNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Branch
                  </p>
                  <p className="text-base font-medium text-gray-800">
                    {submittedStudent.branch}
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
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter you Roll No."
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter you Email Id"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter you Contact No."
                />
                <Input
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter 12-digit Aadhar No."
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
                <Input
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  placeholder="Enter you Branch"
                />
                <Input
                  label="College Name"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your College"
                />
                <Input
                  label="Batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  placeholder="Enter Batch (e.g. 2022-26)"
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
                    label="12th Percentage"
                    name="percentage12th"
                    value={formData.percentage12th}
                    onChange={handleChange}
                    required
                    placeholder="Enter 12th % (e.g. 88%)"
                  />
                </div>
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
