import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import ProfileDialog from "../components/ProfileDialog";
import { useLoading } from "../context/LoadingProvider";

export default function Profile() {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const isDark = mode === "dark";
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const[update, setUpdate] = useState(false);
  console.log(authUser);
  const {loading,setLoading} = useLoading();

  const handleLogout = async () => {
    setLoading(true);
    try {
      Cookies.remove("jwt");
      await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );
      setAuthUser(null);
      window.location.reload();
      navigate("/login");
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  const showTopics = (e) =>{
    setLoading(true);
    e.preventDefault();
    navigate("/topics");
    setLoading(false);
  }

  const profilePhoto = "data:image/png;base64,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" || authUser?.photoUrl ;

  return (
    <>
     {
      update ? <ProfileDialog setUpdate={setUpdate} /> : ""
      
     }
     <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      {!isDark ? (
        <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-blue-100 via-cyan-50 to-white animate-gradient bg-[length:400%_400%]" />
      ) : (
        <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      )}

      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Your <span className="text-blue-600 dark:text-blue-400">Profile</span>
        </h1>
        <button
          onClick={() => setMode(isDark ? "light" : "dark")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all duration-200 ${
            isDark
              ? "bg-white text-black border-white"
              : "bg-black text-white border-black"
          }`}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex items-center justify-center px-6 pb-12 pt-2">
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-xl border transition-all duration-300 ${
            isDark
              ? "bg-gray-800/80 text-white border-gray-700"
              : "bg-white text-gray-900 border-gray-200"
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
              src={profilePhoto}
              alt={`${authUser?.name}'s avatar`}
            />

            {/* Name */}
            <h2 className="mt-5 text-2xl font-semibold text-center">
              {authUser?.name || "Unnamed User"}
            </h2>

            {/* Topic Count */}
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Topics added:{" "}
              <span className={`font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                {authUser?.topics?.length || 0}
              </span>
            </p>

            {/* Edit Button */}
            <div className="flex gap-5" >
                <button
              onClick={(e) => {
                setUpdate(true);
              }}
              className={`mt-6 px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                isDark
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={showTopics}
              className={`mt-6 px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                isDark
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              View Topics
            </button>
            </div>
            <div>
              <button
              onClick={handleLogout}
              className={`mt-6 px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                isDark
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              Logout
            </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}
