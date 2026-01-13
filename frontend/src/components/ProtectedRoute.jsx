import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // In a real app, you might want to verify token validity with an API call
  // or decode it to check expiration. For now, simple cookie check or
  // checking if we kept a login flag in localStorage/Context.
  // Since we used httpOnly cookies, frontend can't read them directly easily
  // without an API call to /me or check.

  // For this simple implementation, let's assume we store a flag in localStorage on login
  // Or better, we trust the API to return 401 and handle it in axios interceptor.
  // BUT, to prevent accessing the route *visually*, we need some client state.

  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
