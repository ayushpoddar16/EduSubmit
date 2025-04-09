import React from "react";

const Navbar = ({ onNewNote, onSave, isSaving, onExport }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50 ">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* App Title */}
          <h1 className="text-3xl font-bold tracking-wide">Notes App</h1>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onNewNote}
              className="px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all duration-200 shadow-md"
            >
              New Note
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`px-5 py-2 rounded-lg shadow-md transition-all duration-200 ${
                isSaving
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onExport}
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-all duration-200 shadow-md"
            >
              Export Notes
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
