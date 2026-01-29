import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MonitorPlay,
  ShieldCheck,
  LogIn,
  ScanQrCode,
} from "lucide-react";
import Button from "../components/Button";

const AdminPortal = () => {
  const navigate = useNavigate();
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  // Optional: Redirect to login if not logged in?
  // The user asked for a page to navigate easily. If not logged in, they should probably see a Login button.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <ShieldCheck className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nalanda College of Engineering
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
          {isAdminLoggedIn ? (
            <>
              <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6">
                <p className="text-sm text-green-700 text-center font-medium">
                  Logged in as{" "}
                  {JSON.parse(localStorage.getItem("adminUser"))?.role ===
                  "volunteer"
                    ? "Volunteer"
                    : "Admin"}
                </p>
              </div>

              {/* Hide Dashboard for Volunteers */}
              {JSON.parse(localStorage.getItem("adminUser"))?.role !==
                "volunteer" && (
                <Link to="/admin/dashboard" className="block w-full group">
                  <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group-hover:bg-blue-50">
                    <div className="p-3 bg-blue-100 rounded-full mr-4 group-hover:bg-white">
                      <LayoutDashboard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                        Dashboard
                      </h3>
                      <p className="text-sm text-gray-500">
                        View overall stats and student list
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              <Link to="/admin/queue" className="block w-full group">
                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group-hover:bg-purple-50">
                  <div className="p-3 bg-purple-100 rounded-full mr-4 group-hover:bg-white">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700">
                      Queue Manager
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage interview flow
                    </p>
                  </div>
                </div>
              </Link>

              <Link to="/admin/scan" className="block w-full group">
                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group-hover:bg-indigo-50">
                  <div className="p-3 bg-indigo-100 rounded-full mr-4 group-hover:bg-white">
                    <ScanQrCode className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700">
                      Scan QR Code
                    </h3>
                    <p className="text-sm text-gray-500">For Scanning QR</p>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <Link to="/admin/login" className="block w-full group">
              <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group-hover:bg-blue-50">
                <div className="p-3 bg-blue-100 rounded-full mr-4 group-hover:bg-white">
                  <LogIn className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                    Login
                  </h3>
                  <p className="text-sm text-gray-500">Access admin account</p>
                </div>
              </div>
            </Link>
          )}

          <div className="border-t border-gray-100 my-4 pt-4">
            <Link to="/board" className="block w-full group">
              <div className="flex items-center p-4 bg-gray-900 border border-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:border-gray-700 transition-all cursor-pointer">
                <div className="p-3 bg-gray-800 rounded-full mr-4">
                  <MonitorPlay className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Public Board</h3>
                  <p className="text-sm text-gray-400">
                    View live status screen
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
