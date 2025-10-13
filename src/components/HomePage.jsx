import React from 'react';
import Header from './Header';
import BlogList from './BlogList';
import Pagination from './Pagination';
import ViewToggle from './ViewToggle';
import PostFilterToggle from './PostFilterToggle';

const POSTS_PER_PAGE = 6;

const HomePage = ({
  // Data props
  blogs,
  currentUser,
  isLoggedIn,

  // UI State props
  viewMode,
  setViewMode,
  postFilter,
  setPostFilter,
  currentPage,
  setCurrentPage,

  // Handler function props
  handleAddNewClick,
  handleLogout,
  handleEditClick,
  showDeleteModalHandler,
}) => {
  
  // --- Filtering and Pagination Logic ---
  const filteredBlogs = blogs.filter(blog => {
    if (postFilter === 'mine') {
      return currentUser && blog.user_id === currentUser.user_id;
    }
    return true; // For 'all', return every blog
  });

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const currentPosts = filteredBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <>
      <Header 
        onAddNew={handleAddNewClick} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto p-4 pt-32">
        <div className="flex justify-between items-center mb-6">
          {isLoggedIn ? (
            <PostFilterToggle filter={postFilter} setFilter={setPostFilter} />
          ) : (
            <div /> // Placeholder to keep layout consistent
          )}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        <BlogList
          blogs={currentPosts}
          onEdit={handleEditClick}
          onDelete={showDeleteModalHandler}
          viewMode={viewMode}
          currentUserId={currentUser ? currentUser.user_id : null}
          isLoggedIn={isLoggedIn} // This prop is now correctly passed down
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </>
  );
};

export default HomePage;