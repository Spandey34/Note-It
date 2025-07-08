import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingProvider";

export default function ProfileDialog({ setUpdate }) {
  const [mode] = useState(localStorage.getItem("mode") || "light");
  const isDark = mode === "dark";
  const [authUser, setAuthUSer] = useAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.name);
  const {loading,setLoading} =useLoading();

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      const payload = { name, password };
      await axios.post("http://localhost:5000/user/update", payload, {
        withCredentials: true,
      });
      setUpdate(false);
      window.location.reload();
      setLoading(false);
    } catch (error) {
      console.log("Problem", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div
        className={`rounded-xl p-6 w-96 shadow-2xl transition-all duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 text-center ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Update Your Profile
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Your Name"
          className={`w-full p-2 mb-3 rounded-md border transition-all ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="text"
          placeholder="Email"
          className={`w-full p-2 mb-3 rounded-md border transition-all ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={authUser.email}
          disabled
        />

        {/* Password */}
        <input
          type="password"
          placeholder="New Password"
          className={`w-full p-2 mb-3 rounded-md border transition-all ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setUpdate(false);
            }}
            className={`px-4 py-2 rounded-md transition-all ${
              isDark
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-gray-300 text-black hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
