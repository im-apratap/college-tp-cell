import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentForm from "./pages/StudentForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import QueueBoard from "./pages/QueueBoard";
import AdminQueueManager from "./pages/AdminQueueManager";
import AdminPortal from "./pages/AdminPortal";
import ScannerPage from "./pages/ScannerPage";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<StudentForm />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/queue"
            element={
              <ProtectedRoute>
                <AdminQueueManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scan"
            element={
              <ProtectedRoute>
                <ScannerPage />
              </ProtectedRoute>
            }
          />
          <Route path="/board" element={<QueueBoard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
