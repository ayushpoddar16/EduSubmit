// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 text-gray-600 border-t">
      <p>&copy; {new Date().getFullYear()} My Notes App by ayush</p>
    </footer>
  );
};

export default Footer;