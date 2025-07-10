import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileDialog from "../components/ProfileDialog";
import { useLoading } from "../context/LoadingProvider";

export default function Profile() {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const isDark = mode === "dark";
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const { loading, setLoading } = useLoading();

  const handleLogout = async () => {
  setLoading(true);
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    setAuthUser(null);
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  setLoading(false);
  window.location.reload();
};


  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  const showTopics = (e) => {
    setLoading(true);
    e.preventDefault();
    navigate("/topics");
    setLoading(false);
  };

  return (
    <>
      {update && <ProfileDialog setUpdate={setUpdate} />}
      <div className={`min-h-screen relative overflow-hidden font-sans transition-colors duration-300 ${isDark ? "dark" : "light"}`}>
        {/* Dynamic Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 opacity-20 bg-[url('/images/dark-grid.svg')] bg-cover"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 opacity-20 bg-[url('/images/light-grid.svg')] bg-cover"></div>
            </div>
          )}
        </div>

        {/* Header */}
        <header className="relative z-10 p-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            <span className={isDark ? "text-white" : "text-gray-900"}>Your </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
          <button
            onClick={() => setMode(isDark ? "light" : "dark")}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDark
                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700"
            }`}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </header>

        {/* Profile Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12 pt-2">
          <div
            className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
              isDark
                ? "bg-gray-900/70 border-gray-700"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Avatar with Pulse Animation */}
              <div className="relative">
                <img
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  src={authUser.photoUrl}
                  alt={`${authUser?.name}'s avatar`}
                />
                <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-ping ${
                  isDark ? "bg-blue-400/30" : "bg-blue-500/30"
                }`}></div>
              </div>

              {/* Name */}
              <h2 className={`mt-5 text-2xl font-semibold text-center ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                {authUser?.name || "Unnamed User"}
              </h2>

              {/* Email */}
              <p className={`mt-2 text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                {authUser?.email || "No email provided"}
              </p>

              {/* Topic Count */}
              <div className={`mt-4 px-4 py-2 rounded-full ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}>
                <p className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Topics added:{" "}
                  <span className={`font-bold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}>
                    {authUser?.topics?.length || 0}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col w-full mt-6 space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setUpdate(true)}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    } flex-1 max-w-xs`}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={showTopics}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
                      isDark
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    } flex-1 max-w-xs`}
                  >
                    View Topics
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
                    isDark
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                  } w-full`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging out...
                    </div>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
