import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { GrMenu } from "react-icons/gr";
import { useLoading } from "../context/LoadingProvider";

function Links({ selectedTopic, setSelectedTopic }) {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [info, setInfo] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [activeLinkId, setActiveLinkId] = useState(null);
  const [actionType, setActionType] = useState(null); // 'delete' or 'edit'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [topicName, setTopicName] = useState("");
  const { authUser, setAuthUser } = useAuth();
  const [kind, setKind] = useState("");
  const navigate = useNavigate();
  const { topicId } = useParams();
  const{loading,setLoading} = useLoading();

  const isDark = mode === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get links for the selected topic
        const res = await axios.get(`http://localhost:5000/topics/${topicId}`, {
          withCredentials: true,
        });

        // Get topic name
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

      const res = await axios.post("http://localhost:5000/links/add", payload, {
        withCredentials: true,
      });

      setLinks(res.data.links);
      setNewLink("");
      setInfo("");
      setNote("");
      setKind("");
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
        `http://localhost:5000/links/remove/${activeLinkId}`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      setLinks(links.filter((link) => link._id !== activeLinkId));
      setActionType(null);
      setActiveLinkId(null);
      setKind("");
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
        `http://localhost:5000/links/update/${activeLinkId}`,
        payload,
        { withCredentials: true }
      );

      setLinks(res.data.links);
      setNewLink("");
      setInfo("");
      setNote("");
      setActionType(null);
      setActiveLinkId(null);
      setKind("");
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
    setKind(link.kind);
    setActionType("edit");
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
      link.info.toLowerCase().includes(search.toLowerCase()) ||
      link.note.toLowerCase().includes(search.toLowerCase())
  );

  const toggleIt = async ({ e, linkId }) => {
    setLoading(true);
    try {
      const payload = { topicId: topicId };
      const res = await axios.post(
        `http://localhost:5000/links/toggle/${linkId}`,
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
          Links in{" "}
          <span className="text-blue-600 dark:text-blue-400">{topicName}</span>
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={(e) => {
              setSelectedTopic({});
              e.preventDefault();
              navigate("/topics");
            }}
            className={`${secondaryButton} flex items-center gap-1`}
          >
            <span>← Back to Topics</span>
          </button>
          <div className="flex gap-2">
            <div className="relative py-2 group">
              <div className="h-10 w-10 flex justify-center items-center" ><GrMenu className={`${isDark ? "text-white" : "text-black"} h-10 w-8`} /></div>
              <div
                className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md ${
                  isDark ? "bg-[#282142]" : "bg-white"
                } border-gray-100 hidden group-hover:block`}
              >
                <p
                  onClick={() => navigate("/")}
                  className={`flex items-center justify-center cursor-pointer bg-green-500 hover:bg-green-700 px-2 py-2 rounded-md`}
                >
                  Profile
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p
                  onClick={(e) => {
                    setSelectedTopic({});
                    e.preventDefault();
                    navigate("/topics");
                  }}
                  className={`${primaryButton} flex items-center justify-center gap-1 cursor-pointer`}
                >
                  Topics
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p
                  onClick={() => setShowLogoutConfirm(true)}
                  className={`${dangerButton} flex items-center justify-center gap-1 cursor-pointer`}
                >
                  Logout
                </p>
                <hr className="my-2 border-t border-gray-500" />
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
                      <span className="cursor-pointer">Light</span>
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

      {/* Link Input Form */}
      <div>
        <div className="px-6 mb-6">
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              {actionType === "edit" ? "Edit Link" : "Add New Link"}
            </h3>
            <div className="grid gap-3">
              <div className="flex gap-4" >
                <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="link"
                className={`rounded-lg w-[100%] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-200"
                } border`}
              />
                <input
                type="text"
                className={`input w-16 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-200"
                } border`}
                placeholder="Type"
                list="kind"
                onChange={(e) => {
                  setKind(e.target.value);
                }} required
              />
              <datalist id="kind">
                <option value="url" ></option>
                <option value="text"></option>
              </datalist>
              </div>
              
              <input
                type="text"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                placeholder="Title/Info"
                className={`rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-200"
                } border`}
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Notes"
                rows={3}
                className={`rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-200"
                } border`}
              />
              <div className="flex justify-end gap-2">
                {actionType === "edit" && (
                  <button
                    onClick={() => {
                      setActionType(null);
                      setActiveLinkId(null);
                      setNewLink("");
                      setInfo("");
                      setNote("");
                    }}
                    className={`${secondaryButton}`}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={
                    actionType === "edit" ? handleUpdateLink : handleAddLink
                  }
                  disabled={!newLink.trim()}
                  className={`${primaryButton} ${
                    !newLink.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {actionType === "edit" ? "Update" : "Add"} Link
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
            placeholder="Search links..."
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

      {/* Links List */}
      <div className="h-[calc(100vh-320px)] overflow-y-auto custom-scroll px-6 pb-8 pt-2">
        {filteredLinks.length > 0 ? (
          <div className="grid gap-4">
            {filteredLinks.map((link, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-all ${
                  isDark
                    ? "bg-gray-800/80 border-gray-700"
                    : "bg-white border-gray-200"
                } border`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {
                      link.kind==="url" ? <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {link.link}
                    </a> : <p
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {link.link}
                    </p>
                    }
                    
                    {link.note && (
                      <p className="text-sm mt-1 dark:text-gray-300 text-gray-600">
                        {link.note}
                      </p>
                    )}
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 truncate">
                      {link.info}
                    </p>
                  </div>
                  <div className="flex gap-3 ml-2 justify-center items-center">
                    <input
                      type="checkbox"
                       defaultChecked={link.marked ? true : false}
                      className="toggle toggle-warning"
                      onClick={(e) => {
                        toggleIt({ e: e, linkId: link._id });
                      }}
                    />
                    <button
                      onClick={() => handleEditClick(link)}
                      className={`${actionButton} text-yellow-600 hover:text-yellow-700`}
                      title="Edit or Read"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setActiveLinkId(link._id);
                        setActionType("delete");
                      }}
                      className={`${actionButton} text-red-500 hover:text-red-600`}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
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
              {search
                ? "No matching links found"
                : "No links yet for this topic"}
            </p>
            {!search && (
              <button
                onClick={() =>
                  document.querySelector('input[placeholder="link"]')?.focus()
                }
                className={`${primaryButton} mt-4`}
              >
                Add Your First Link
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {actionType === "delete" && (
        <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
          <div
            className={`p-6 rounded-2xl shadow-xl w-80 max-w-full mx-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-4 text-center dark:text-white">
              Delete Link
            </h3>
            <p className="mb-6 text-center dark:text-gray-300">
              Are you sure you want to delete this link?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteLink}
                className={`${dangerButton} flex-1`}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setActionType(null);
                  setActiveLinkId(null);
                }}
                className={`${secondaryButton} flex-1`}
              >
                Cancel
              </button>
            </div>
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
            <h3 className="text-xl font-bold mb-4 text-center dark:text-white">
              Confirm Logout
            </h3>
            <p className="mb-6 text-center dark:text-gray-300">
              Are you sure you want to logout?
            </p>
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

export default Links;
