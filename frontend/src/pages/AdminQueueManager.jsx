import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { ArrowRight, UserCheck, Play, CheckSquare, Clock } from "lucide-react";
import Button from "../components/Button";

// Since strict mode in React 18 can cause issues with beautiful-dnd, we might need a workaround or just use simple buttons for MVP stability.
// Let's stick to Buttons for moving status for maximum reliability first.

const AdminQueueManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQueueData();
  }, []);

  const fetchQueueData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/submissions`,
        { withCredentials: true },
      );
      // Filter only present students
      const allStudents = response.data.data;
      const presentStudents = allStudents.filter((s) => s.isPresent);
      setStudents(presentStudents);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (studentId, newStatus) => {
    // Optimistic update
    setStudents((prev) =>
      prev.map((s) =>
        s._id === studentId ? { ...s, interviewStatus: newStatus } : s,
      ),
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/queue-status/${studentId}`,
        { status: newStatus },
        { withCredentials: true },
      );
      toast.success("Status updated");
      // No need to refetch, state is already updated
    } catch (error) {
      toast.error("Failed to update status");
      // Revert changes on error (could implement a detailed revert logic, but simply refetching works)
      fetchQueueData();
    }
  };

  const filteredPendingStudents = students.filter(
    (s) =>
      s.interviewStatus === "pending" &&
      (s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const nextStudents = students.filter((s) => s.interviewStatus === "next");
  const interviewingStudents = students.filter(
    (s) => s.interviewStatus === "in_interview",
  );
  const completedStudents = students.filter(
    (s) => s.interviewStatus === "completed",
  );

  const renderCard = (student, currentList) => (
    <div
      key={student._id}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-800">{student.fullName}</h4>
          <p className="text-xs text-gray-500 font-mono">{student.uniqueId}</p>
          <p className="text-xs text-gray-500">{student.branch}</p>
        </div>
        <div className="text-right">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold ${student.currentCgpa >= 8 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            CGPA: {student.currentCgpa}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 justify-end">
        {currentList === "pending" && (
          <button
            onClick={() => updateStatus(student._id, "next")}
            className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md font-semibold hover:bg-purple-200 flex items-center gap-1"
          >
            Add to Queue <ArrowRight className="h-3 w-3" />
          </button>
        )}
        {currentList === "next" && (
          <>
            <button
              onClick={() => updateStatus(student._id, "pending")}
              className="text-xs text-gray-500 hover:text-gray-700 px-2"
            >
              Back
            </button>
            <button
              onClick={() => updateStatus(student._id, "in_interview")}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-semibold hover:bg-blue-200 flex items-center gap-1"
            >
              Start Interview <Play className="h-3 w-3" />
            </button>
          </>
        )}
        {currentList === "in_interview" && (
          <button
            onClick={() => updateStatus(student._id, "completed")}
            className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-semibold hover:bg-green-200 flex items-center gap-1"
          >
            Complete <CheckSquare className="h-3 w-3" />
          </button>
        )}
        {currentList === "completed" && (
          <span className="text-xs text-green-600 font-bold flex items-center gap-1">
            <CheckSquare className="h-3 w-3" /> Done
          </span>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Interview Queue Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage student flow for the interview panel
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-150px)] overflow-hidden">
        {/* Pending */}
        <div className="flex flex-col bg-gray-100 rounded-xl overflow-hidden h-full">
          <div className="bg-gray-200 p-3 font-semibold text-gray-700 flex flex-col gap-2 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Waiting Room (
              {filteredPendingStudents.length})
            </div>
            <input
              type="text"
              placeholder="Search ID/Name..."
              className="w-full text-xs p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {filteredPendingStudents.length === 0 && (
              <p className="text-gray-400 text-sm text-center italic">
                No students found
              </p>
            )}
            {filteredPendingStudents.map((s) => renderCard(s, "pending"))}
          </div>
        </div>

        {/* Next Up */}
        <div className="flex flex-col bg-purple-50 rounded-xl overflow-hidden h-full border border-purple-100">
          <div className="bg-purple-100 p-3 font-semibold text-purple-900 flex items-center gap-2 border-b border-purple-200">
            <Clock className="h-4 w-4" /> Up Next ({nextStudents.length})
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {nextStudents.length === 0 && (
              <p className="text-purple-300 text-sm text-center italic">
                Queue empty
              </p>
            )}
            {nextStudents.map((s) => renderCard(s, "next"))}
          </div>
        </div>

        {/* In Interview */}
        <div className="flex flex-col bg-blue-50 rounded-xl overflow-hidden h-full border border-blue-100">
          <div className="bg-blue-100 p-3 font-semibold text-blue-900 flex items-center gap-2 border-b border-blue-200">
            <Play className="h-4 w-4" /> Interviewing (
            {interviewingStudents.length})
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {interviewingStudents.length === 0 && (
              <p className="text-blue-300 text-sm text-center italic">
                No active interviews
              </p>
            )}
            {interviewingStudents.map((s) => renderCard(s, "in_interview"))}
          </div>
        </div>

        {/* Completed */}
        <div className="flex flex-col bg-green-50 rounded-xl overflow-hidden h-full border border-green-100">
          <div className="bg-green-100 p-3 font-semibold text-green-900 flex items-center gap-2 border-b border-green-200">
            <CheckSquare className="h-4 w-4" /> Completed (
            {completedStudents.length})
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {completedStudents.length === 0 && (
              <p className="text-green-300 text-sm text-center italic">
                No completed interviews
              </p>
            )}
            {completedStudents.map((s) => renderCard(s, "completed"))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQueueManager;
