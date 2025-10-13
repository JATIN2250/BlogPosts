import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

const Card = ({ blog, onEdit, onDelete, currentUserId, viewMode = 'grid', isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOwner = currentUserId === blog.user_id;

  const truncateDescription = (text, length = 100) => {
    if (!text || text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  };

  const containerClasses = viewMode === 'grid'
    ? "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full relative"
    : "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row w-full relative";
  
  const imageClasses = viewMode === 'grid' ? "w-full h-56 object-cover" : "w-full sm:w-1/3 h-48 sm:h-auto object-cover";
  const contentClasses = viewMode === 'grid' ? "p-4 flex flex-col flex-grow" : "p-4 flex flex-col flex-grow sm:w-2/3";

  return (
    <div className={containerClasses}>
      {isOwner && (
        <div ref={menuRef} className="absolute top-2 right-2 z-20">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition" aria-label="Options">
            <BsThreeDotsVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-xl py-1">
              <button onClick={() => { onEdit(blog); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Post</button>
              <button onClick={() => { onDelete(blog.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete Post</button>
            </div>
          )}
        </div>
      )}
      
      {blog.image_url && <img className={imageClasses} src={`http://localhost:5000${blog.image_url}`} alt={blog.title} />}

      <div className={contentClasses}>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">{blog.title}</h2>
        <p className="text-gray-600 flex-grow mb-3">
          {truncateDescription(blog.description)}
          {blog.description && blog.description.length > 100 && (
          
            <Link to={`/blog/${blog.id}`} className="text-blue-500 font-semibold ml-1 hover:underline">
                more
            </Link>
            
          )}
        </p>
        <p className="text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
          By: <span className="font-semibold">{blog.username}</span>
        </p>
      </div>
    </div>
  );
};

export default Card;