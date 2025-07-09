// src/context/AuthProvider.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUserState] = useState(null);

  // Sync authUser and token to localStorage whenever updated
  const setAuthUser = (user) => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    }
    setAuthUserState(user);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (token && storedUser) {
      setAuthUserState(JSON.parse(storedUser));
    }

    const getAuthUser = async () => {
      if (token) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          setAuthUser(res.data.user); // refresh data from backend
        } catch (error) {
          console.error("Invalid token or user not found.");
          setAuthUser(null);
        }
      }
    };

    getAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
