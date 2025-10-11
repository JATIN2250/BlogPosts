import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import ConfirmationModal from './components/ConfirmationModel';
import Pagination from './components/Pagination';
import ViewToggle from './components/ViewToggle';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PostFilterToggle from './components/PostFilterToggle';
 // Import the new component

const POSTS_PER_PAGE = 6;

function App() {
  // State for data and UI
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  
  // State for Modals and Forms
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false);
  const [isLoginPageVisible, setIsLoginPageVisible] = useState(false);
  const [isRegisterPageVisible, setIsRegisterPageVisible] = useState(false);

  // State for Authentication and User Data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Holds logged-in user's details (id, username)
  const [postFilter, setPostFilter] = useState('all'); // 'all' or 'mine'

  // --- DATA FETCHING ---

  // Fetches all blog posts from the server
  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }, []);

  // Fetches the currently logged-in user's data using the token
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/users/auth', {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error("Token invalid");
        
        const userData = await response.json();
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Could not fetch user, logging out:", error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    }
  }, []);
  
  // Initial data fetch on component mount
  useEffect(() => {
    fetchBlogs();
    fetchCurrentUser();
  }, [fetchBlogs, fetchCurrentUser]);

  // --- HANDLERS ---

  const handleLoginSuccess = () => {
    fetchCurrentUser(); // Fetch user data after a successful login
    setIsLoginPageVisible(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPostFilter('all');
    alert('Logged out successfully') // Reset filter on logout
  };

  const handleAddNewClick = () => {
    if (isLoggedIn) {
      setEditingBlog(null);
      setIsBlogFormVisible(true);
    } else {
      setIsLoginPageVisible(true);
    }
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setIsBlogFormVisible(true);
  };

  const blogSavedHandler = () => {
    setIsBlogFormVisible(false);
    setEditingBlog(null);
    fetchBlogs(); // Refresh blog list
  };
  
  const confirmDeleteHandler = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/blogs/${deletingBlogId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      setDeletingBlogId(null);
      fetchBlogs(); // Refresh blog list
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  // --- FILTERING AND PAGINATION LOGIC ---

  // Filter blogs based on the "All" / "Mine" toggle
  const filteredBlogs = blogs.filter(blog => {
    if (postFilter === 'mine') {
      return currentUser && blog.user_id === currentUser.user_id;
    }
    return true; // For 'all', return every blog
  });

  // Apply pagination to the filtered list
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const currentPosts = filteredBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 min-h-screen">
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
          onDelete={(id) => setDeletingBlogId(id)}
          viewMode={viewMode}
          currentUserId={currentUser ? currentUser.user_id : null}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* --- MODALS AND FORMS --- */}

      {isBlogFormVisible && (
        <BlogForm
          onBlogAdded={blogSavedHandler}
          onClose={() => setIsBlogFormVisible(false)}
          existingBlog={editingBlog}
        />
      )}

      {isLoginPageVisible && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onClose={() => setIsLoginPageVisible(false)}
          onNavigateToRegister={() => {
            setIsLoginPageVisible(false);
            setIsRegisterPageVisible(true);
          }}
        />
      )}
      
      {isRegisterPageVisible && (
        <RegisterPage onClose={() => setIsRegisterPageVisible(false)} />
      )}
      
      {deletingBlogId && (
        <ConfirmationModal 
            message="Are you sure you want to delete this blog post?" 
            onConfirm={confirmDeleteHandler} 
            onCancel={() => setDeletingBlogId(null)} 
        />
      )}
    </div>
  );
}

export default App;