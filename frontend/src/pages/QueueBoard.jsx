import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, User, ArrowRight, Loader, Hourglass } from "lucide-react";

const QueueBoard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll every 10 seconds
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/placement/queue-status`,
      );
      setQueue(response.data.data);
    } catch (error) {
      console.error("Failed to fetch queue status:", error);
    } finally {
      setLoading(false);
    }
  };

  const interviewing = queue.filter(
    (s) => s.interviewStatus === "in_interview",
  );
  const nextInLine = queue.filter((s) => s.interviewStatus === "next");
  const standbyStudents = queue.filter((s) => s.interviewStatus === "standby");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">
        <Loader className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Nalanda College of Engineering
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            Live updates for the placement drive
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currently Interviewing */}
          <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Currently Interviewing
              </h2>
            </div>

            {interviewing.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">
                No interviews in progress
              </div>
            ) : (
              <div className="grid gap-4">
                {interviewing.map((student) => (
                  <div
                    key={student.uniqueId}
                    className="group relative bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {student.fullName}
                        </h3>
                        <p className="text-md text-gray-600 font-medium">
                          {student.branch}
                        </p>
                        <p className="text-sm text-gray-500 font-mono mt-1">
                          ID: {student.uniqueId}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Live
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Up Next */}
          <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Next in Line</h2>
            </div>

            {nextInLine.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">
                Queue is empty
              </div>
            ) : (
              <div className="grid gap-4">
                {nextInLine.map((student, index) => (
                  <div
                    key={student.uniqueId}
                    className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-bold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {student.fullName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="font-medium text-gray-600">
                            {student.branch}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="font-mono">{student.uniqueId}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Standby */}
          <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Hourglass className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Standby</h2>
            </div>

            {standbyStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">
                No students on standby
              </div>
            ) : (
              <div className="grid gap-4">
                {standbyStudents.map((student, index) => (
                  <div
                    key={student.uniqueId}
                    className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {student.fullName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="font-medium text-gray-600">
                            {student.branch}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>Nalanda College of Engineering • Training and Placement Cell</p>
        </footer>
      </div>
    </div>
  );
};

export default QueueBoard;
