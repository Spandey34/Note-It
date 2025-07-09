import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { GrMenu } from "react-icons/gr";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLink,
  FiArrowLeft,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingProvider";

function Links({ selectedTopic, setSelectedTopic }) {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [info, setInfo] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [activeLinkId, setActiveLinkId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [topicName, setTopicName] = useState("");
  const { authUser, setAuthUser } = useAuth();
  const [kind, setKind] = useState("url");
  const navigate = useNavigate();
  const { topicId } = useParams();
  const { loading, setLoading } = useLoading();

  const isDark = mode === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://note-it-n0cc.onrender.com/topics/${topicId}`, {
          withCredentials: true,
        });
        setTopicName(res.data.topic.name);
        setLinks(res.data.topic.links);
        setLoading(false);
      } catch (error) {
        console.log("Error", error.message);
        setLoading(false);
      }
    };

    if (selectedTopic) {
      fetchData();
    }
  }, [selectedTopic]);

  const handleAddLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmed = newLink.trim();
    if (!trimmed) return;

    try {
      const payload = {
        link: newLink,
        info: info,
        note: note,
        topicId: topicId,
        kind: kind,
      };

      const res = await axios.post("https://note-it-n0cc.onrender.com/links/add", payload, {
        withCredentials: true,
      });

      setLinks(res.data.links);
      setNewLink("");
      setInfo("");
      setNote("");
      setKind("url");
      setLoading(false);
    } catch (error) {
      console.log("Error adding link:", error.message);
      setLoading(false);
    }
  };

  const handleDeleteLink = async () => {
    setLoading(true);
    try {
      const payload = { topicId: topicId };
      const res = await axios.post(
        `https://note-it-n0cc.onrender.com/links/remove/${activeLinkId}`,
        payload,
        { withCredentials: true }
      );
      setLinks(links.filter((link) => link._id !== activeLinkId));
      setActionType(null);
      setActiveLinkId(null);
      setLoading(false);
    } catch (error) {
      console.log("Error deleting link:", error.message);
      setLoading(false);
    }
  };

  const handleUpdateLink = async () => {
    setLoading(true);
    try {
      const payload = {
        newLink: newLink,
        info: info,
        newNote: note,
        topicId: topicId,
        kind: kind,
      };

      const res = await axios.post(
        `https://note-it-n0cc.onrender.com/links/update/${activeLinkId}`,
        payload,
        { withCredentials: true }
      );

      setLinks(res.data.links);
      setNewLink("");
      setInfo("");
      setNote("");
      setActionType(null);
      setActiveLinkId(null);
      setKind("url");
      setLoading(false);
    } catch (error) {
      console.log("Error updating link:", error.message);
      setLoading(false);
    }
  };

  const handleEditClick = (link) => {
    setNewLink(link.link);
    setInfo(link.info);
    setNote(link.note);
    setActiveLinkId(link._id);
    setKind(link.kind || "url");
    setActionType("edit");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      Cookies.remove("jwt");
      await axios.post(
        "https://note-it-n0cc.onrender.com/user/logout",
        {},
        { withCredentials: true }
      );
      setAuthUser({});
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

  const filteredLinks = links.filter(
    (link) =>
      link.info?.toLowerCase().includes(search.toLowerCase()) ||
      link.note?.toLowerCase().includes(search.toLowerCase()) ||
      link.link?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleIt = async ({ e, linkId }) => {
    setLoading(true);
    try {
      const payload = { topicId: topicId };
      const res = await axios.post(
        `https://note-it-n0cc.onrender.com/links/toggle/${linkId}`,
        payload,
        { withCredentials: true }
      );
      setLinks(res.data.links);
      setLoading(false);
    } catch (error) {
      console.log("Error in toggling!");
      setLoading(false);
    }
  };

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
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              setSelectedTopic({});
              navigate("/topics");
            }}
            className={`p-2 rounded-full ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            <FiArrowLeft
              className={`h-5 w-5 ${isDark ? "text-white" : "text-gray-800"}`}
            />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className={isDark ? "text-white" : "text-gray-900"}>
              Links in{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {topicName}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode(isDark ? "light" : "dark")}
            className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            } transition-colors`}
          >
            {isDark ? (
              <>
                <FiSun className="h-4 w-4 text-yellow-400" />
              </>
            ) : (
              <>
                <FiMoon className="h-4 w-4" />
              </>
            )}
          </button>
          <div className="relative py-2 group">
            <div className="flex justify-center items-center">
              <GrMenu
                className={`${isDark ? "text-white" : "text-black"} h-7 w-7`}
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
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
                  isDark
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } transition-colors mb-2`}
              >
                <span>Profile</span>
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
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

      {/* Link Input Form */}
      <div className=" z-10 px-6 mb-6">
        <div
          className={`p-6 rounded-xl shadow-lg ${
            isDark ? "bg-gray-800/90" : "bg-white/90"
          } backdrop-blur-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {actionType === "edit" ? "Edit Link" : "Add New Link"}
          </h3>

          <form
            onSubmit={actionType === "edit" ? handleUpdateLink : handleAddLink}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Paste your link here"
                  className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                      : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
                  } shadow-sm`}
                  required
                />
              </div>

              <div className="relative">
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  } shadow-sm`}
                >
                  <option value="url">URL</option>
                  <option value="text">Text</option>
                </select>
                <div
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <FiLink className="h-5 w-5" />
                </div>
              </div>
            </div>

            <input
              type="text"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Title/Description"
              className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
              } shadow-sm`}
            />

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
              } shadow-sm`}
            />

            <div className="flex justify-end gap-3">
              {actionType === "edit" && (
                <button
                  type="button"
                  onClick={() => {
                    setActionType(null);
                    setActiveLinkId(null);
                    setNewLink("");
                    setInfo("");
                    setNote("");
                    setKind("url");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } shadow-md hover:shadow-lg`}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!newLink.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !newLink.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } shadow-md hover:shadow-lg flex items-center gap-2`}
              >
                <FiPlus className="h-4 w-4" />
                <span>{actionType === "edit" ? "Update" : "Add"} Link</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search */}
      <div className="relative z-10 px-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
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

      {/* Links List */}
      <div className="relative z-10 h-[calc(100vh-320px)] overflow-y-auto custom-scroll px-6 pb-8 pt-2">
        {filteredLinks.length > 0 ? (
          <div className="grid gap-4">
            {filteredLinks.map((link) => (
              <div
                key={link._id}
                className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border ${
                  isDark
                    ? "bg-gray-800/80 border-gray-700 hover:bg-gray-700/90"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                } ${
                  link.marked
                    ? isDark
                      ? "ring-2 ring-yellow-500"
                      : "ring-2 ring-yellow-400"
                    : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {link.kind === "url" ? (
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg font-semibold hover:underline truncate ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {link.link}
                        </a>
                      ) : (
                        <p
                          className={`text-lg font-semibold ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {link.link}
                        </p>
                      )}
                    </div>

                    {link.info && (
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {link.info}
                      </p>
                    )}

                    {link.note && (
                      <p
                        className={`text-sm mt-2 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {link.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.marked || false}
                        onChange={(e) => toggleIt({ e, linkId: link._id })}
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-11 h-6 rounded-full peer ${
                          isDark
                            ? "bg-gray-600 peer-checked:bg-yellow-500"
                            : "bg-gray-200 peer-checked:bg-yellow-400"
                        } peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                      ></div>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(link)}
                        className={`p-2 rounded-md ${
                          isDark
                            ? "hover:bg-gray-700 text-blue-400"
                            : "hover:bg-gray-100 text-blue-600"
                        } transition-colors`}
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveLinkId(link._id);
                          setActionType("delete");
                        }}
                        className={`p-2 rounded-md ${
                          isDark
                            ? "hover:bg-gray-700 text-red-400"
                            : "hover:bg-gray-100 text-red-600"
                        } transition-colors`}
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div
              className={`p-6 rounded-full ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              } mb-6`}
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
              className={`text-lg mb-6 text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {search
                ? "No matching links found"
                : "No links yet for this topic"}
            </p>
            {!search && (
              <button
                onClick={() =>
                  document
                    .querySelector('input[placeholder="Paste your link here"]')
                    ?.focus()
                }
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } shadow-md hover:shadow-lg flex items-center gap-2`}
              >
                <FiPlus className="h-4 w-4" />
                <span>Add Your First Link</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {actionType === "delete" && (
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
              Delete Link
            </h3>
            <p
              className={`mb-6 text-center ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Are you sure you want to delete this link?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteLink}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } shadow-md hover:shadow-lg`}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setActionType(null);
                  setActiveLinkId(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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

export default Links;
