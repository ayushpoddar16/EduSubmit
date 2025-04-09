import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 text-white py-10 shadow-lg">
      <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-8">
        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div>
            <h4 className="font-semibold text-lg mb-4 pb-2 border-b border-blue-300">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Mobile App
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Extensions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 pb-2 border-b border-blue-300">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-teal-200 transition-all duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Links Section */}
        <div className="flex flex-wrap justify-center gap-4 py-4 border-t border-b border-blue-300 w-full max-w-4xl">
          <a
            href="#"
            className="px-4 py-2 text-sm hover:bg-blue-600 hover:bg-opacity-50 rounded-lg transition-all duration-300"
          >
            Help Center
          </a>
          <a
            href="#"
            className="px-4 py-2 text-sm hover:bg-blue-600 hover:bg-opacity-50 rounded-lg transition-all duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="px-4 py-2 text-sm hover:bg-blue-600 hover:bg-opacity-50 rounded-lg transition-all duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="px-4 py-2 text-sm hover:bg-blue-600 hover:bg-opacity-50 rounded-lg transition-all duration-300"
          >
            Cookie Policy
          </a>
          <a
            href="#"
            className="px-4 py-2 text-sm hover:bg-blue-600 hover:bg-opacity-50 rounded-lg transition-all duration-300"
          >
            FAQ
          </a>
        </div>

        {/* Social Links and Copyright */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm flex items-center">
            &copy; {currentYear} <span className="font-semibold mx-1">MyNotes</span> by Ayush. Made with{' '}
            <Heart size={14} className="mx-1 text-red-300" /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;