import React from 'react';
import Card from './card';

// 1. Receive 'isLoggedIn' as a prop in the function signature.
const BlogList = ({ blogs, onEdit, onDelete, viewMode, currentUserId, isLoggedIn }) => {
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
              blog={blog} 
              onEdit={onEdit}
              onDelete={onDelete}
              viewMode={viewMode}
              currentUserId={currentUserId}
              // 2. Pass the 'isLoggedIn' prop down to each Card component.
              isLoggedIn={isLoggedIn} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;