// src/components/PostFilterToggle.js

import React from 'react';

const PostFilterToggle = ({ filter, setFilter }) => {
  return (
    <div className="flex bg-gray-200 rounded-lg p-1">
      <button
        onClick={() => setFilter('all')}
        className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
          filter === 'all' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
        }`}
      >
        All
      </button>
      <button
        onClick={() => setFilter('mine')}
        className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
          filter === 'mine' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
        }`}
      >
        Mine
      </button>
    </div>
  );
};

export default PostFilterToggle;