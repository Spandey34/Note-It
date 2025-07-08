import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingProvider";
import { GrMenu } from "react-icons/gr";

export default function Topics({selectedTopic, setSelectedTopic}) {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [newTopic, setNewTopic] = useState("");
  const [search, setSearch] = useState("");
  const [authUser, setAuthUser] = useAuth();
  const [topics, setTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [actionType, setActionType] = useState(null); // 'delete' or 'rename'
  const [renameValue, setRenameValue] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const{loading,setLoading} = useLoading();

  const isDark = mode === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/topics",
          { withCredentials: true }
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
    const payload = { user: authUser, name: trimmed };
    const res = await axios.post("http://localhost:5000/topics/add", payload, {
      withCredentials: true,
    });
    Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
    setTopics(res.data.user.topics);
    setNewTopic("");
    setAuthUser(res.data.user);
    setLoading(false);
  };

  const handleDeleteTopic = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      console.log(activeTopicId);
      const payload = { user: authUser};
      const res = await axios.post(
      `http://localhost:5000/topics/delete/${activeTopicId}`,{},
      { withCredentials: true }
    );
     setTopics(res.data.topics);
     setLoading(false);
    } catch (error) {
      console.log("Error", error.message);
      setLoading(false);
    }
    setActionType(null);
  };

  const handleRenameTopic = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      console.log(activeTopicId);
      const payload = { newName: renameValue};
      const res = await axios.post(
      `http://localhost:5000/topics/rename/${activeTopicId}`,payload,
      { withCredentials: true }
    );
    console.log(res.data.topics);
     setTopics(res.data.topics);
     setLoading(false);
    } catch (error) {
      console.log("Error", error.message);
      setLoading(false);
    }
    setActionType(null);
  };

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
      setShowLogoutConfirm(false);
      window.location.reload();
      navigate("/login");
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setShowLogoutConfirm(false);
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter((t) =>
     t.name.toLowerCase().includes(search.toLowerCase())
  );

  // Button style classes for consistency
  const primaryButton = `px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
    isDark ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
  } text-white shadow-md hover:shadow-lg`;

  const secondaryButton = `px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
    isDark ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
  } text-white shadow-md hover:shadow-lg`;

  const dangerButton = `px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
    isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
  } text-white shadow-md hover:shadow-lg`;

  const actionButton = `px-3 py-1 rounded-md font-medium text-sm transition-all ${
    isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
  } shadow-sm hover:shadow-md`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      {!isDark && (
        <div className="absolute inset-0 z-[-1] animate-gradient bg-gradient-to-br from-blue-50 via-cyan-50 to-white bg-[length:400%_400%]" />
      )}
      {isDark && (
        <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      )}

      {/* Header */}
      <div className="p-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Your <span className="text-blue-600 dark:text-blue-400">Topics</span>
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="New Topic"
              className={`rounded-lg px-4 py-2 w-40 sm:w-48 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-200"
              } border`}
              onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <button
              onClick={handleAddTopic}
              className={`${primaryButton} flex items-center gap-1`}
            >
              <span>Add</span>
            </button>
          </div>
          <div className="flex gap-2">
            
            <div className='relative py-2 group'>
          <div className="h-10 w-10 flex justify-center items-center" ><GrMenu className={`${isDark ? "text-white" : "text-black"} h-10 w-8`} /></div>
          
          <div className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md ${isDark ? "bg-[#282142]" : "bg-white"}  border-gray-100 hidden group-hover:block`} >
            <p onClick={() =>{
              setLoading(true);
              navigate('/');
              setLoading(false);
              }} className ={`flex items-center justify-center cursor-pointer  bg-green-500 hover:bg-green-700 px-2 py-2 rounded-md`}>Profile</p>
            <hr className='my-2 border-t border-gray-500' />
            <p onClick={() => setShowLogoutConfirm(true)}
              className={`${dangerButton} flex items-center justify-center gap-1 cursor-pointer`}>Logout</p>
              <hr className='my-2 border-t border-gray-500' />
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDark
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              } shadow-md hover:shadow-lg flex items-center gap-1`}
            >
              {isDark ? (
                <>
                  <span>☀️</span>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <span>🌙</span>
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="h-[calc(100vh-220px)] overflow-y-auto custom-scroll px-6 pb-8 pt-2">
        {filteredTopics.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTopics.map((topic, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl shadow-lg hover:-translate-y-1 transform transition-all duration-200 border ${
                  isDark
                    ? "bg-gray-800/80 text-white border-gray-700 hover:shadow-xl"
                    : "bg-white text-gray-900 border-gray-200 hover:shadow-xl"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-semibold mb-2 truncate">
                    {topic.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setActiveTopicId(topic._id);
                        setActionType("rename");
                        setRenameValue(topic.name);
                      }}
                      className={`${actionButton} text-yellow-600 hover:text-yellow-700`}
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setActiveTopicId(topic._id);
                        setActionType("delete");
                      }}
                      className={`${actionButton} text-red-500 hover:text-red-600`}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm mb-4">
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
                  className={`w-full mt-2 py-2 rounded-lg font-medium transition-all ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white shadow-md hover:shadow-lg`} onClick={(e) =>{
                    e.preventDefault();
                    const obj = {
                      topicId: topic._id,
                      name: topic.name
                    };
                    setSelectedTopic(obj);
                    navigate(`/links/${topic._id}`);
                  }}
                >
                  View Links
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
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
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {search ? "No matching topics found" : "No topics yet"}
            </p>
            {!search && (
              <button
                onClick={() =>
                  document
                    .querySelector('input[placeholder="New Topic"]')
                    ?.focus()
                }
                className={`${primaryButton} mt-4`}
              >
                Create Your First Topic
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete/Rename Confirmation Modal */}
      {(actionType === "delete" || actionType === "rename") && (
        <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
          <div
            className={`p-6 rounded-2xl shadow-xl w-80 max-w-full mx-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-4 text-center">
              {actionType === "delete" ? "Delete Topic" : "Rename Topic"}
            </h3>

            {actionType === "delete" ? (
              <>
                <p className="mb-6 text-center">
                  Delete "{topics[activeTopicId]?.name}" permanently?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDeleteTopic}
                    className={`${dangerButton} flex-1`}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setActionType(null);
                      setActiveTopicId(null);
                    }}
                    className={`${secondaryButton} flex-1`}
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
                  className={`w-full px-4 py-2 mb-6 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  }`}
                  autoFocus
                  onKeyPress={(e) => e.key === "Enter" && handleRenameTopic()}
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRenameTopic}
                    disabled={!renameValue.trim()}
                    className={`${primaryButton} flex-1 ${
                      !renameValue.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      setActionType(null);
                      setActiveTopicId(null);
                    }}
                    className={`${secondaryButton} flex-1`}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
          <div
            className={`p-6 rounded-2xl shadow-xl w-80 max-w-full mx-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-4 text-center">
              Confirm Logout
            </h3>
            <p className="mb-6 text-center">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className={`${dangerButton} flex-1`}
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`${secondaryButton} flex-1`}
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
