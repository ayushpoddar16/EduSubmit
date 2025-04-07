import React, { useState } from "react";

const NotesList = ({
  notes,
  currentNote,
  onNoteSelect,
  onDeleteNote,
  onUpdateNoteTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lastEdited"); // 'lastEdited', 'title'
  const [editingNoteId, setEditingNoteId] = useState(null); // Track which note is being edited
  const [editedTitle, setEditedTitle] = useState(""); // Track the edited title

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "lastEdited") {
      const dateA =
        a.lastEdited instanceof Date ? a.lastEdited : new Date(a.lastEdited);
      const dateB =
        b.lastEdited instanceof Date ? b.lastEdited : new Date(b.lastEdited);
      return dateB.getTime() - dateA.getTime();
    } else if (sortBy === "title") {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return 0;
  });

  const handleEditTitle = (noteId, title) => {
    setEditingNoteId(noteId);
    setEditedTitle(title); // Set the current title as the initial value for editing
  };

  const handleSaveTitle = (noteId) => {
    if (editedTitle.trim() === "") {
      alert("The note title is empty. It has been renamed to 'Untitled Note....'.");
      setEditedTitle("Untitled Note"); // Temporarily set the title in the input field
      onUpdateNoteTitle(noteId, "Untitled Note"); // Update the title to "Untitled Note"
      setTimeout(() => setEditingNoteId(null), 0); // Exit edit mode
      return;
    }

    // Only update if the title has changed
    if (editedTitle !== notes.find((note) => note.id === noteId).title) {
      onUpdateNoteTitle(noteId, editedTitle); // Call the parent function to update the title
    }

    setEditingNoteId(null); // Exit edit mode
  };

  return (
    <div
      className="w-72 bg-white p-4 mr-4 rounded-lg shadow-md flex flex-col"
      style={{ maxHeight: "690px", overflowY: "auto" }}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Your Notes ({notes.length})
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 flex">
        <button
          onClick={() => setSortBy("lastEdited")}
          className={`flex-1 py-1 px-2 text-sm rounded-l ${
            sortBy === "lastEdited"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => setSortBy("title")}
          className={`flex-1 py-1 px-2 text-sm rounded-r ${
            sortBy === "title"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          A-Z
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        {sortedNotes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No notes found</p>
        ) : (
          <div className="space-y-2">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-md transition-colors relative group flex items-center justify-between ${
                  note.id === currentNote.id
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {editingNoteId === note.id ? (
                  <div className="flex items-center w-full space-x-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(note.id)} // Save on blur
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle(note.id); // Save on Enter key
                      }}
                      className="flex-grow p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSaveTitle(note.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-200"
                      title="Save"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div
                      onClick={() => onNoteSelect(note.id)} // Call the parent function to select the note
                      className="cursor-pointer flex-grow pr-4"
                    >
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.lastEdited).toLocaleDateString()} •
                        {new Date(note.lastEdited).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(note.id, note.title); // Enable edit mode
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200"
                        title="Edit note title"
                      >
                        Edit
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Are you sure you want to delete this note?"
                            )
                          ) {
                            onDeleteNote(note.id); // Call the parent function to delete the note
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-200"
                        title="Delete note"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
