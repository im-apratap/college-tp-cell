import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import {
  LogOut,
  FileText,
  Search,
  Trash2,
  X,
  QrCode,
  CheckCircle,
} from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedStudent, setScannedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/submissions`,
        {
          withCredentials: true,
        }
      );
      setStudents(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("isAdminLoggedIn");
        navigate("/admin/login");
      } else {
        toast.error("Failed to fetch submissions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("adminUser");
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleDeleteClick = (student) => {
    console.log("Delete clicked for:", student);
    setStudentToDelete(student);
    setDeleteModalOpen(true);
    setDeleteConfirmation("");
  };

  const confirmDelete = async () => {
    if ((deleteConfirmation || "").trim().toLowerCase() !== "delete") {
      toast.error("Please type 'delete' to confirm.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/admin/submissions/${
          studentToDelete._id
        }`,
        { withCredentials: true }
      );

      setStudents(students.filter((s) => s._id !== studentToDelete._id));
      toast.success("Student profile deleted successfully");
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete profile");
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.uniqueId?.toLowerCase().includes(term) ||
      student.fullName?.toLowerCase().includes(term) ||
      student.rollNumber?.toLowerCase().includes(term) ||
      student.aadharNumber?.toLowerCase().includes(term)
    );
  });

  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const scannedId = detectedCodes[0].rawValue;
      const foundStudent = students.find(
        (s) => s.uniqueId?.toLowerCase() === scannedId.toLowerCase()
      );

      if (foundStudent) {
        setScannedStudent(foundStudent);
        setScanning(false);
        toast.success("Student found!");
      } else {
        toast.error(`No student found with ID: ${scannedId}`);
        // Optionally keep scanning or close
        setScanning(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    toast.error("Failed to access camera");
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Placement Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search Bar */}
          <div className="mb-6 flex gap-4">
            <div className="relative rounded-md shadow-sm max-w-lg w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3"
                placeholder="Search by Unique ID, Name, Roll No, or Aadhar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setScanning(true)}
              className="flex items-center gap-2"
            >
              <QrCode className="h-5 w-5" />
              Scan QR
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading submissions...</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Unique ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Student Info
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Aadhar No.
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Academic (10th/12th)
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            College / Batch
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Current CGPA
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-6 py-4 text-center text-gray-500 text-sm"
                            >
                              No submissions found matching your search.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr key={student._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-mono font-bold text-blue-600">
                                  {student.uniqueId || "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {student.fullName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {student.email}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {student.phone}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Roll: {student.rollNumber}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {student.aadharNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  10th: {student.percentage10th}
                                </div>
                                <div className="text-sm text-gray-500">
                                  12th: {student.percentage12th}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {student.collegeName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.branch} ({student.batch})
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">
                                  {student.currentCgpa}
                                </div>
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    student.activeBacklogs > 0
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {student.activeBacklogs} Backlogs
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteClick(student)}
                                  className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                                  title="Delete Profile"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Scanner Modal */}
      {scanning && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
            <button
              onClick={() => setScanning(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Scan Student QR Code
            </h3>
            <div className="overflow-hidden rounded-lg bg-black">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                styles={{ container: { width: "100%" } }}
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Align the QR code within the frame to scan.
            </p>
          </div>
        </div>
      )}

      {/* Scanned Student Modal */}
      {scannedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative shadow-xl">
            <button
              onClick={() => setScannedStudent(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Student Verified
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Student details found in the database.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                <div className="mb-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Full Name
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {scannedStudent.fullName}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Unique ID
                  </p>
                  <p className="text-md font-mono font-bold text-blue-600">
                    {scannedStudent.uniqueId}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Roll Number
                  </p>
                  <p className="text-md text-gray-800">
                    {scannedStudent.rollNumber}
                  </p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Branch & Batch
                  </p>
                  <p className="text-sm text-gray-800">
                    {scannedStudent.branch} ({scannedStudent.batch})
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => {
                    setSearchTerm(scannedStudent.uniqueId);
                    setScannedStudent(null);
                  }}
                >
                  View in Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setDeleteModalOpen(false)}
            ></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Delete Student Profile
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the profile for{" "}
                        <span className="font-bold text-gray-800">
                          {studentToDelete?.fullName}
                        </span>{" "}
                        ({studentToDelete?.uniqueId})? This action cannot be
                        undone.
                      </p>
                      <p className="mt-4 text-sm text-gray-600">
                        Type{" "}
                        <span className="font-mono font-bold text-red-600">
                          delete
                        </span>{" "}
                        below to confirm.
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Type delete to confirm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={
                    (deleteConfirmation || "").trim().toLowerCase() !== "delete"
                  }
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    (deleteConfirmation || "").trim().toLowerCase() === "delete"
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;
