// src/hooks/useDisablePaste.js
import { useEffect } from 'react';

export const useDisablePaste = () => {
  // Function to clear clipboard
  const clearClipboard = () => {
    try {
      navigator.clipboard.writeText("")
        .catch(err => {
          console.error("Could not clear clipboard: ", err);
        });
    } catch (error) {
      console.error("Clipboard API not available: ", error);
    }
  };

  // Effect to add global paste event listener
  useEffect(() => {
    const handleGlobalPaste = (e) => {
      // Check if the active element is within the editor
      const editorIframe = document.querySelector('.tox-edit-area__iframe');
      if (editorIframe && (
          document.activeElement === editorIframe || 
          editorIframe.contentDocument?.activeElement
      )) {
        e.preventDefault();
        e.stopPropagation();
        alert("Pasting is disabled in this editor.");
        clearClipboard();
        return false;
      }
    };

    // Add event listener for paste at document level
    document.addEventListener('paste', handleGlobalPaste, true);

    // Cleanup
    return () => {
      document.removeEventListener('paste', handleGlobalPaste, true);
    };
  }, []);

  return {
    clearClipboard
  };
};