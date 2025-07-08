import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
  const {loading,setLoading} = useLoading();

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
          ? "http://localhost:5000/user/signup"
          : "http://localhost:5000/user/login";

      const res = await axios.post(url, payload, { withCredentials: true });
      setMsg(res.data.message);

      // Set auth user and cookie
      setAuthUser(res.data.user);
      
      navigate("/");
      setLoading(false);
    } catch (error) {
      setMsg(error.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Backgrounds */}
      {!isDark && (
        <div className="absolute inset-0 z-[-1] animate-gradient bg-gradient-to-br from-blue-200 via-cyan-100 to-white bg-[length:400%_400%]" />
      )}
      {isDark && (
        <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-black via-gray-900 to-gray-800" />
      )}

      {/* Header Section */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {state === "signup" ? "Create " : "Welcome to "}
          <span className="text-blue-600 dark:text-blue-400">Account</span>
        </h1>
        <button
          onClick={() => setMode(isDark ? "light" : "dark")}
          className={`px-4 py-2 rounded-lg font-medium transition border backdrop-blur-sm text-sm ${
            isDark
              ? "bg-white text-black border-white"
              : "bg-black text-white border-black"
          }`}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Auth Card */}
      <div className="flex items-center justify-center px-6 pb-8 pt-2">
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-lg border ${
            isDark
              ? "bg-gray-800/70 text-white border-gray-700"
              : "bg-white/90 text-gray-900 border-gray-200"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            {state === "signup" ? "Sign Up" : "Log In"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {state === "signup" && (
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`px-4 py-2 rounded-lg border outline-none ${
                  isDark
                    ? "dark:text-white border dark:border-gray-600"
                    : "bg-white/90 text-gray-900 border-gray-200"
                }`}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`px-4 py-2 rounded-lg border outline-none ${
                isDark
                  ? "dark:text-white border dark:border-gray-600"
                  : "bg-white/90 text-gray-900 border-gray-200"
              }`}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`px-4 py-2 rounded-lg border outline-none ${
                isDark
                  ? "dark:text-white border dark:border-gray-600"
                  : "bg-white/90 text-gray-900 border-gray-200"
              }`}
            />

            {state === "signup" && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`px-4 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "dark:text-white border dark:border-gray-600"
                      : "bg-white/90 text-gray-900 border-gray-200"
                  }`}
                />
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p
                      className={`${
                        isDark ? "text-yellow-300" : "text-red-700"
                      } text-sm`}
                    >
                      Passwords do not match
                    </p>
                  )}
              </>
            )}

            <button
              type="submit"
              className={`mt-4 px-4 py-2 text-sm rounded-md font-medium transition cursor-pointer ${
                isDark
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {state === "signup" ? "Sign Up" : "Log In"}
            </button>
          </form>

          {msg && (
            <p className="text-center mt-4 text-sm">
              <span
                className={
                  msg.includes("wrong") ? "text-red-400" : "text-green-400"
                }
              >
                {msg}
              </span>
            </p>
          )}

          <p className="text-sm text-center mt-6">
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
              className={`ml-2 font-medium cursor-pointer ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              {state === "signup" ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
