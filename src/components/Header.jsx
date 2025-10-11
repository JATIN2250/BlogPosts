import React from "react";

const Header = ({ onAddNew, isLoggedIn, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Heading */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-snug">
            Featured Blogs
          </h1>
          <div className="w-32 h-1 mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center">
          <button
            onClick={onAddNew}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            + Add New Blog
          </button>

          {/* Conditionally render Logout button */}
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="ml-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-transform"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;