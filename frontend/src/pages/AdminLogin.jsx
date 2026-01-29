import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
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

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Determine if input is email or username
      const isEmail = formData.username.includes("@");
      const payload = {
        password: formData.password,
        username: isEmail ? "" : formData.username,
        email: isEmail ? formData.username : "",
      };

      // Ensure credentials allows cookies to be set
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Login successful");

      // Update global auth state
      login(response.data.data.user);

      // Set flag for ProtectedRoute (backup mechanism)
      localStorage.setItem("isAdminLoggedIn", "true");
      // Store user info if needed
      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.data.data.user)
      );

      // Redirect to dashboard immediately
      navigate("/admin");
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
