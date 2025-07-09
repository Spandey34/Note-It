import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingProvider";

export default function Login() {
  const [state, setState] = useState("signup");
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  const isDark = mode === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (state === "signup" && password !== confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      const payload =
        state === "signup" ? { name, email, password } : { email, password };

      const url =
        state === "signup"
          ? "https://localhost:5000/user/signup"
          : "https://localhost:5000/user/login";

      const res = await axios.post(url, payload, { withCredentials: true });
      setMsg(res.data.message);

      setAuthUser(res.data.user);
      navigate("/");
      setLoading(false);
    } catch (error) {
      setMsg(error.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col transition-colors duration-300 ${isDark ? "dark" : "light"}`}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden transition-opacity duration-500">
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-100"></div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white opacity-100"></div>
        )}
        <div className="absolute inset-0 opacity-20">
          {isDark ? (
            <div className="w-full h-full bg-[url('/images/dark-pattern.svg')] bg-cover"></div>
          ) : (
            <div className="w-full h-full bg-[url('/images/light-pattern.svg')] bg-cover"></div>
          )}
        </div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          <span className={`${isDark ? "text-white" : "text-gray-900"}`}>
            {state === "signup" ? "Create " : "Welcome to "}
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Account
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

      {/* Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-8 pt-2">
        <div
          className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-lg transition-all duration-500 border ${
            isDark
              ? "bg-gray-900/70 border-gray-700"
              : "bg-white/90 border-gray-200"
          }`}
        >
          <div className="flex justify-center mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <h2 className={`text-3xl font-bold text-center mb-6 ${
            isDark ? "text-white" : "text-gray-800"
          }`}>
            {state === "signup" ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {state === "signup" && (
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400 focus:border-transparent placeholder-gray-500"
                  }`}
                />
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400 focus:border-transparent placeholder-gray-500"
                }`}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400 focus:border-transparent placeholder-gray-500"
                }`}
              />
            </div>

            {state === "signup" && (
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400 focus:border-transparent placeholder-gray-500"
                  }`}
                />
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p
                      className={`mt-1 text-sm ${
                        isDark ? "text-yellow-300" : "text-red-600"
                      }`}
                    >
                      Passwords do not match
                    </p>
                  )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              } flex items-center justify-center`}
            >
              {loading ? (
                <>
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
                  Processing...
                </>
              ) : state === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {msg && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                msg.includes("wrong")
                  ? isDark
                    ? "bg-red-900/50 text-red-200"
                    : "bg-red-100 text-red-800"
                  : isDark
                  ? "bg-green-900/50 text-green-200"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {msg}
            </div>
          )}

          <p className={`text-center mt-6 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {state === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              onClick={() => {
                setState(state === "signup" ? "login" : "signup");
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setMsg("");
              }}
              className={`ml-2 font-semibold ${
                isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
              } transition-colors duration-200`}
            >
              {state === "signup" ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
