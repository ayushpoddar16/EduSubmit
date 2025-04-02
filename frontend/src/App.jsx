// Updated App.jsx
import React, { useCallback, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import Footer from "./components/Footer";
import { useNotes } from "./hooks/useNotes";

const App = () => {
  const {
    notes,
    currentNote,
    isSaving,
    handleSave,
    createNewNote,
    switchToNote,
    updateCurrentNoteContent,
    updateNoteTitle, // Provided by `useNotes`
    deleteNote,
    exportNotes,
    importNotes,
  } = useNotes();

  const [getCurrentContent, setGetCurrentContent] = useState(() => () => "");

  const handleContentChange = useCallback((getContentFn) => {
    setGetCurrentContent(() => getContentFn);
  }, []);

  const handleNewNote = () => {
    createNewNote(); // This will use the default placeholder content
  };

  const handleNoteSelect = (noteId) => {
    // Save the current note's content before switching
    const currentContent = getCurrentContent();
    // Switch to the selected note
    switchToNote(noteId, () => currentContent);
  };

  const handleSaveNote = () => {
    const currentContent = getCurrentContent(); // Get the latest content
    handleSave(currentContent); // Save the current note's content
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(noteId, getCurrentContent); // Pass getCurrentContent to deleteNote
  };

  const handleExportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.json"; // The name of the exported file
    a.click();
    URL.revokeObjectURL(url);
  };

  // **New function to update the note title**
  const handleUpdateNoteTitle = (noteId, newTitle) => {
    updateNoteTitle(noteId, newTitle); // Use the `updateNoteTitle` function from `useNotes`
  };

  const allNotes = React.useMemo(() => {
    const uniqueNotes = [...notes];
    if (!uniqueNotes.some((note) => note.id === currentNote.id)) {
      uniqueNotes.push(currentNote);
    }
    return uniqueNotes;
  }, [notes, currentNote]);

    // Scroll to the top when the component mounts
    useEffect(() => {
      const scrollToTop = () => {
        window.scrollTo(0, 0); // Scroll to the top-left corner of the page
      };
    
      // Add a slight delay to ensure the DOM is fully rendered
      const timeoutId = setTimeout(scrollToTop, 0);
    
      return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
    }, []);
  return (
    <div className="flex flex-col min-h-screen bg-purple-300">
      <Navbar
        onNewNote={handleNewNote}
        onSave={handleSaveNote}
        isSaving={isSaving}
        onExport={handleExportNotes}
        onImport={importNotes}
      />

      <main className="flex flex-grow container mx-auto p-4 pt-16">
        <NotesList
          notes={allNotes}
          currentNote={currentNote}
          onNoteSelect={handleNoteSelect}
          onDeleteNote={handleDeleteNote}
          onUpdateNoteTitle={updateNoteTitle} // Use the centralized function
        />

        <NoteEditor
          note={currentNote}
          onTitleChange={(newTitle) =>
            updateNoteTitle(currentNote.id, newTitle)
          }
          onSave={handleSave}
          onContentChange={(getContent) =>
            updateCurrentNoteContent(getContent())
          } // Use the centralized function
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
