import { useState, useEffect } from "react";

export const useNotes = () => {
  // Load notes from localStorage on initialization
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      return JSON.parse(savedNotes).map((note) => ({
        ...note,
        lastEdited: new Date(note.lastEdited), // Ensure dates are proper Date objects
      }));
    }
    return [];
  });

  // Load the current note from localStorage or create a default note
  const [currentNote, setCurrentNote] = useState(() => {
    const savedCurrentNote = localStorage.getItem("currentNote");
    if (savedCurrentNote) {
      const parsedNote = JSON.parse(savedCurrentNote);
      return {
        ...parsedNote,
        lastEdited: new Date(parsedNote.lastEdited),
      };
    }
    return {
      id: Date.now(),
      title: "Untitled Note",
      content: "<p>This is the initial content of the editor.</p>",
      lastEdited: new Date(),
    };
  });

  // Tracking save state
  const [isSaving, setIsSaving] = useState(false);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Save the current note to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentNote", JSON.stringify(currentNote));
  }, [currentNote]);

  // Create a new note
  const createNewNote = (content = "<p>Write here...</p>") => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content, // Default content with placeholder
      lastEdited: new Date(),
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNote(newNote);
  };

  // Update the title of a note
  const updateNoteTitle = (noteId, newTitle) => {
    const titleToUse = newTitle.trim() ? newTitle : "Untitled Note";
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId && note.title !== newTitle // Only update if the title has changed
          ? { ...note, title: newTitle, lastEdited: new Date() }
          : note
      )
    );

    // Ensure the currentNote is updated if it's the same note
    if (currentNote.id === noteId && currentNote.title !== newTitle) {
      setCurrentNote((prevNote) => ({
        ...prevNote,
        title: newTitle,
        lastEdited: new Date(),
      }));
    }
  };

  // Update the content of the current note
  const updateCurrentNoteContent = (newContent) => {
    // Only update if content has changed and isn't empty
    if (typeof newContent === "string" && newContent !== currentNote.content) {
      const now = new Date();

      // Update the current note
      setCurrentNote((prevNote) => ({
        ...prevNote,
        content: newContent,
        lastEdited: now,
      }));

      // Update the note in the notes array
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === currentNote.id
            ? { ...note, content: newContent, lastEdited: now }
            : note
        )
      );
    }
  };

  // Switch to a different note
  const switchToNote = (noteId) => {
    if (currentNote.id === noteId) return; // Already on this note

    // Find the note to switch to
    const nextNote = notes.find((note) => note.id === noteId);
    if (nextNote) {
      // Update the current note
      setCurrentNote({ ...nextNote });
    }
  };

  // Delete a note
  const deleteNote = (noteId) => {
    // If deleting the current note, switch to another note first
    if (currentNote.id === noteId) {
      const remainingNotes = notes.filter((note) => note.id !== noteId);
      if (remainingNotes.length > 0) {
        setCurrentNote(remainingNotes[0]);
      } else {
        // Create a new note if we're deleting the last one
        createNewNote();
      }
    }

    // Remove the note from the notes array
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  // Export notes as JSON
  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save the current note
  const handleSave = (content) => {
    if (!content || typeof content !== "string") return;

    setIsSaving(true);

    // Update the current note
    const now = new Date();
    setCurrentNote((prevNote) => ({
      ...prevNote,
      content,
      lastEdited: now,
    }));

    // Update the notes array
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === currentNote.id
          ? { ...note, content, lastEdited: now }
          : note
      )
    );

    // Simulate a small delay to show saving indicator
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return {
    notes,
    currentNote,
    isSaving,
    createNewNote,
    updateNoteTitle,
    updateCurrentNoteContent,
    switchToNote,
    deleteNote,
    exportNotes,
    handleSave,
  };
};

export default useNotes;
