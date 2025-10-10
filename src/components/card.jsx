// src/components/Card.js (Updated)

import React from 'react';

const Card = ({ img, title, description, onEdit, onDelete, viewMode = 'grid' }) => {
  // Conditional classes based on viewMode
  const containerClasses = viewMode === 'grid'
    ? "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
    : "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row w-full";
  
  const imageClasses = viewMode === 'grid'
    ? "w-full h-56 object-cover"
    : "w-full sm:w-1/3 h-48 sm:h-auto object-cover";

  const contentClasses = viewMode === 'grid'
    ? "p-4 flex flex-col flex-grow"
    : "p-4 flex flex-col flex-grow sm:w-2/3";

  return (
    <div className={containerClasses}>
      {/* Image */}
      {img && <img className={imageClasses} src={img} alt={title} />}

      {/* Content */}
      <div className={contentClasses}>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 flex-grow">{description}</p>
        
        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onEdit} className="px-3 py-1 text-sm font-semibold text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition">
            Edit
          </button>
          <button onClick={onDelete} className="px-3 py-1 text-sm font-semibold text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;