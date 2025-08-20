import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingProvider";
import { GrMenu } from "react-icons/gr";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

export default function Topics({ selectedTopic, setSelectedTopic }) {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [newTopic, setNewTopic] = useState("");
  const [search, setSearch] = useState("");
  const [authUser, setAuthUser] = useAuth();
  const [topics, setTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  const isDark = mode === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/topics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopics(res.data.topics);
      } catch (error) {
        console.log("Error", error.message);
      } 
    };
    getTopics();
  }, []);

  const handleAddTopic = async (e) => {
    setLoading(true);
    e.preventDefault();
    const trimmed = newTopic.trim();
    if (!trimmed) return;

    const token = localStorage.getItem("authToken");
    const payload = { user: authUser, name: trimmed };

    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/topics/add`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTopics(res.data.user.topics);
    setNewTopic("");
    setAuthUser(res.data.user);
    setLoading(false);
  };

  const handleDeleteTopic = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/topics/delete/${activeTopicId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTopics(res.data.topics);
    } catch (error) {
      console.log("Error", error.message);
    }

    setLoading(false);
    setActionType(null);
  };

  const handleRenameTopic = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const payload = { newName: renameValue };
      const res = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/topics/rename/${activeTopicId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTopics(res.data.topics);
    } catch (error) {
      console.log("Error", error.message);
    }

    setLoading(false);
    setActionType(null);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setAuthUser(null);
      setShowLogoutConfirm(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setLoading(false);
    window.location.reload();
  };

  const filteredTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDark ? "dark" : "light"
      }`}
    >
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/dark-grid.svg')] bg-cover"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/light-grid.svg')] bg-cover"></div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Topics
          </span>
        </h1>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="New Topic"
              className={`rounded-lg px-4 py-2 w-40 sm:w-48 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
              } border shadow-sm`}
              onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <button
              onClick={handleAddTopic}
              disabled={!newTopic.trim()}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-1 ${newTopic.trim()&&"cursor-pointer"} ${
                !newTopic.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <FiPlus className="h-4 w-4" />
              <span>Add</span>
            </button>
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className={`h-9 w-9 p-3 rounded-full text-sm flex items-center gap-2 cursor-pointer ${
                !isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-yellow-200 hover:bg-yellow-300 text-gray-800"
              } transition-colors`}
            >
              {isDark ? (
                <>
                  <FiSun className="h-4 w-4 text-yellow-700 " />
                </>
              ) : (
                <>
                  <FiMoon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Dropdown Menu */}
          <div className="relative py-2 group">
            <div className="flex justify-center items-center">
              <GrMenu
                className={`${isDark ? "text-white" : "text-black"} h-6 w-6`}
              />
            </div>

            <div
              className={`absolute top-full right-0  w-40 p-3 rounded-lg shadow-xl ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border hidden group-hover:block transition-all duration-200`}
            >
              <button
                onClick={() => {
                  setLoading(true);
                  navigate("/");
                  setLoading(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } transition-colors mb-2`}
              >
                <span>Profile</span>
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? "bg-red-700 hover:bg-red-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } transition-colors mb-2`}
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="px-6 mb-6 z-10">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className={`w-full px-4 py-2 pl-10 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
            } shadow-sm`}
          />
          <div
            className={`absolute left-3 top-2.5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <FiSearch className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="h-[calc(100vh-220px)] overflow-y-auto custom-scroll px-6 pb-8 pt-2 relative z-10">
        {filteredTopics.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic._id}
                className={`p-6 rounded-2xl shadow-lg hover:-translate-y-1 transform transition-all duration-300 border ${
                  isDark
                    ? "bg-gray-800/80 hover:bg-gray-700/90 text-white border-gray-700 hover:shadow-xl"
                    : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:shadow-xl"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold mb-2 truncate">
                    {topic.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveTopicId(topic._id);
                        setActionType("rename");
                        setRenameValue(topic.name);
                      }}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        isDark
                          ? "hover:bg-gray-700 text-blue-400"
                          : "hover:bg-gray-100 text-blue-600"
                      }`}
                      title="Rename"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTopicId(topic._id);
                        setActionType("delete");
                      }}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        isDark
                          ? "hover:bg-gray-700 text-red-400"
                          : "hover:bg-gray-100 text-red-600"
                      }`}
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Links:{" "}
                  <span
                    className={`font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {topic.links?.length || 0}
                  </span>
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTopic({
                      topicId: topic._id,
                      name: topic.name,
                    });
                    navigate(`/links/${topic._id}`);
                  }}
                  className={`w-full mt-2 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } shadow-md hover:shadow-lg`}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div
              className={`mb-6 p-6 rounded-full ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-16 w-16 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p
              className={`text-lg mb-6 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {search ? "No matching topics found" : "No topics yet"}
            </p>
            {!search && (
              <button
                onClick={() =>
                  document
                    .querySelector('input[placeholder="New Topic"]')
                    ?.focus()
                }
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } shadow-md hover:shadow-lg flex items-center gap-2`}
              >
                <FiPlus className="h-4 w-4" />
                <span>Create Your First Topic</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {(actionType === "delete" || actionType === "rename") && (
        <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50 backdrop-blur-sm transition-opacity duration-300">
          <div
            className={`p-6 rounded-2xl shadow-xl w-80 max-w-full mx-4 transform transition-all duration-300 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 text-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {actionType === "delete" ? "Delete Topic" : "Rename Topic"}
            </h3>

            {actionType === "delete" ? (
              <>
                <p
                  className={`mb-6 text-center ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Delete "{topics.find((t) => t._id === activeTopicId)?.name}"
                  permanently?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDeleteTopic}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 ${
                      isDark
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    } shadow-md hover:shadow-lg`}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setActionType(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } shadow-md hover:shadow-lg`}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className={`w-full px-4 py-2 mb-6 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                      : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
                  } shadow-sm`}
                  autoFocus
                  onKeyPress={(e) => e.key === "Enter" && handleRenameTopic()}
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRenameTopic}
                    disabled={!renameValue.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 ${
                      !renameValue.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    } shadow-md hover:shadow-lg`}
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => setActionType(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } shadow-md hover:shadow-lg`}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50 backdrop-blur-sm transition-opacity duration-300">
          <div
            className={`p-6 rounded-2xl shadow-xl w-80 max-w-full mx-4 transform transition-all duration-300 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 text-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Confirm Logout
            </h3>
            <p
              className={`mb-6 text-center ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 ${
                  isDark
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } shadow-md hover:shadow-lg`}
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
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } shadow-md hover:shadow-lg`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
