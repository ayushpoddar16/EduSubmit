import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useDisablePaste } from "../hooks/useDisablePaste";

const NoteEditor = ({ note, onTitleChange, onSave, onContentChange }) => {
  const editorRef = useRef(null);
  const { clearClipboard } = useDisablePaste();

  // Format the date for display
  const formatDate = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Unknown date";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  // Auto-save functionality
  const handleEditorChange = (newContent) => {
    // Save automatically when content changes
    if (onContentChange) {
      onContentChange(() => newContent);
    }
  };

  const getCurrentContent = () => {
    return editorRef.current ? editorRef.current.getContent() : note.content;
  };

  // Expose the getCurrentContent function to the parent component
  useEffect(() => {
    if (onContentChange) {
      onContentChange(getCurrentContent);
    }
  }, [onContentChange]);

  return (
    <div className="flex-grow">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        {/* Editable Title */}
        <input
          type="text"
          value={note.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-2xl font-bold mb-4 p-2 border-b border-gray-300 focus:border-blue-400 focus:outline-none"
          placeholder="Enter file name here..."
        />

        {/* TinyMCE Editor */}
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          onEditorChange={handleEditorChange} // This will auto-save as user types
          value={note.content} // Use value instead of initialValue to properly update content
          init={{
            height: 600,
            menubar: true,
            browser_spellcheck: true,
            branding: false,
            resize: true,
            statusbar: true,
            paste_as_text: false,
            paste_block_drop: true,
            paste_data_images: false,
            autofocus: true, // Automatically focus editor when loaded
            toolbar:
              "undo redo | bold italic underline strikethrough | styleselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat help",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "emoticons",
            ],
            formats: {
              bold: { inline: "strong" },
              italic: { inline: "em" },
              underline: {
                inline: "span",
                styles: { textDecoration: "underline" },
              },
              strikethrough: {
                inline: "span",
                styles: { textDecoration: "line-through" },
              },
            },
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 16px; 
                line-height: 1.6;
                padding: 15px;
                max-width: 900px;
                margin: 0 auto;
                background-color:rgb(135, 235, 196);
                color: #333;
              }
              h1, h2, h3, h4, h5, h6 { margin-top: 0.5em; margin-bottom: 0.5em; }
              p { margin-bottom: 1em; }
              img { max-width: 100%; height: auto; }
              strong { font-weight: bold; }
              em { font-style: italic; }
            `,
            custom_undo_redo_levels: 50,
            forced_root_block: "p",
            menu: {
              edit: { title: "Edit", items: "undo redo | cut copy selectall" }, // Removed 'paste'
            },
            setup: function (editor) {
              // Intercept paste (Ctrl+V or Command+V)
              editor.on("keydown", function (e) {
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
                  e.preventDefault();
                  e.stopPropagation();
                  alert("Pasting is disabled in this editor.");
                  clearClipboard();
                  return false;
                }
              });
              
              // Place cursor at the end of the content when focusing
              editor.on('focus', function() {
                // Only move cursor to end on initial focus
                editor.selection.select(editor.getBody(), true);
                editor.selection.collapse(false);
              });
            },
          }}
        />
      </div>

      <div className="text-right text-sm text-gray-500">
        Last edited: {formatDate(note.lastEdited)}
      </div>
    </div>
  );
};

export default NoteEditor;