// src/components/ViewToggle.js

import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md ${
          viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}
        aria-label="Grid View"
      >
        <FiGrid size={20} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md ${
          viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}
        aria-label="List View"
      >
        <FiList size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;