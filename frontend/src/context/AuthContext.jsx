import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/me`,
        {
          withCredentials: true,
        },
      );
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      // Optional: Clear localStorage if sync is needed, but we rely on state now
      localStorage.removeItem("isAdminLoggedIn");
    } finally {
      setIsLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    // Only check auth if accessing admin routes
    if (
      location.pathname.startsWith("/admin") &&
      location.pathname !== "/admin/login"
    ) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
