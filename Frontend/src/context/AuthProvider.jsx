import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("jwt"); 
    const  getAuthUser = async () => {
         if (userCookie) {
      try {
        const res = await axios.get("http://localhost:5000/user", { withCredentials: true });
        setAuthUser(res.data.user);
      } catch (error) {
        console.error("Invalid user cookie format");
      }
    }
    }
    getAuthUser();
    
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);