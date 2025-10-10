// src/components/BlogList.js (Updated)

import React from 'react';
import Card from './Card';

const BlogList = ({ blogs, onEdit, onDelete, viewMode }) => {
  // Conditional classes for the container
  const containerClasses = viewMode === 'grid'
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    : "flex flex-col gap-8";

  return (
    <div className="mt-8"> {/* Removed container classes, will be handled by parent */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full">No blogs found. Add one!</p>
      ) : (
        <div className={containerClasses}>
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              title={blog.title}
              description={blog.description}
              img={`http://localhost:5000${blog.image_url}`}
              onEdit={() => onEdit(blog)}
              onDelete={() => onDelete(blog.id)}
              viewMode={viewMode} // Pass viewMode to Card
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;