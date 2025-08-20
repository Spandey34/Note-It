import React from "react";
import { FiLink, FiPlus, FiX } from "react-icons/fi";

function LinkFormDialog({
  open,
  onClose,
  actionType,
  newLink,
  setNewLink,
  info,
  setInfo,
  note,
  setNote,
  kind,
  setKind,
  handleSubmit,
  isDark,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div
        className={`relative w-[90%] max-w-2xl p-6 rounded-2xl shadow-lg ${
          isDark ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-200"
        } border`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 cursor-pointer"
        >
          <FiX className="h-6 w-6" />
        </button>

        <h3
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {actionType === "edit" ? "Edit Link" : "Add New Link"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Link + Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Paste your link/heading here"
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

          {/* Info & Note */}
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } shadow-md hover:shadow-lg`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newLink.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${newLink.trim()&&"cursor-pointer"} ${
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
  );
}

export default LinkFormDialog;
