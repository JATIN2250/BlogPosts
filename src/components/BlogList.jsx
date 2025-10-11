import React from 'react';
import Card from './card';

const BlogList = ({ blogs, onEdit, onDelete, viewMode, currentUserId }) => {
  return (
    <div className="mt-8">
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full">
          No blogs found.
        </p>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              // This is the fix: Pass the entire blog object as a single prop
              blog={blog} 
              // Pass the other necessary props
              onEdit={onEdit}
              onDelete={onDelete}
              viewMode={viewMode}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;