import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Barcode from "react-barcode";
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
    cgpa: "",
    activeBacklogs: 0,
    registrationNumber10th: "",
    registrationNumber12th: "",
    aadharNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedStudent, setSubmittedStudent] = useState(null);

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
        cgpa: parseFloat(formData.cgpa),
        activeBacklogs: parseInt(formData.activeBacklogs),
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
        cgpa: "",
        activeBacklogs: 0,
        registrationNumber10th: "",
        registrationNumber12th: "",
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
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your application has been received. Please save your Unique ID and
            Barcode.
          </p>

          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Unique ID
            </p>
            <p className="text-xl font-mono font-bold text-blue-600">
              {submittedStudent.uniqueId}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Barcode
              value={submittedStudent.uniqueId}
              width={2}
              height={50}
              displayValue={false}
            />
          </div>

          <Button
            variant="primary"
            onClick={() => setSubmittedStudent(null)}
            className="w-full"
          >
            Submit Another Response
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="mb-8 text-center">
            <img
              src="/nce-logo.png"
              alt="nce-logo"
              className="mx-auto h-20 w-20 text-blue-600"
            />
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
                  placeholder="2022-2026"
                />
                <Input
                  label="CGPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                  placeholder="8.5"
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

            {/* Professional Details (Reg Nos only now) */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" /> Academic
                Registration #
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="10th Registration Number"
                    name="registrationNumber10th"
                    value={formData.registrationNumber10th}
                    onChange={handleChange}
                    required
                    placeholder="Enter 10th Reg No."
                  />
                  <Input
                    label="12th Registration Number"
                    name="registrationNumber12th"
                    value={formData.registrationNumber12th}
                    onChange={handleChange}
                    required
                    placeholder="Enter 12th Reg No."
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
