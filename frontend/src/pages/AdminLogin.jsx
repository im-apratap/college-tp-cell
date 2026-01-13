import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/Input";
import Button from "../components/Button";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "", // You can also support email login if backend supports it
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects username OR email. Let's assume input is username for now, or use a single field.
      // But our UI asks for username/email. Let's send both or filter.
      // The backend check: $or: [{ username }, { email }]
      // If user types in 'email' field in UI, send as email.

      const payload = {
        password: formData.password,
        username: formData.username,
        email: formData.username.includes("@") ? formData.username : "", // Simple heuristic
      };

      // Ensure credentials allows cookies to be set
      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/login",
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Login successful");

      // Set flag for ProtectedRoute
      localStorage.setItem("isAdminLoggedIn", "true");
      // Store user info if needed
      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.data.data.user)
      );

      // Redirect to dashboard
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Sign In
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="admin"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminLogin;
