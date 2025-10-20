import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages and Components
import HomePage from './components/HomePage';
import SinglePostPage from './components/SinglePost';
import BlogForm from './components/BlogForm';
import ConfirmationModal from './components/ConfirmationModel';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [postFilter, setPostFilter] = useState('all');

  // --- DATA FETCHING ---
  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch('http://backend.blogocean.publicvm.com/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) { console.error('Error fetching blogs:', error); }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://backend.blogocean.publicvm.com/api/users/auth', {
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
  
  useEffect(() => {
    fetchBlogs();
    fetchCurrentUser();
  }, [fetchBlogs, fetchCurrentUser]);

  // --- HANDLERS ---
  const handleLoginSuccess = () => {
    fetchCurrentUser();
    setIsLoginPageVisible(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPostFilter('all');
    alert(`Logged out successfully.`)
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
    fetchBlogs();
  };
  
  const confirmDeleteHandler = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://backend.blogocean.publicvm.com/api/blogs/${deletingBlogId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      setDeletingBlogId(null);
      fetchBlogs();
    } catch (error) { console.error('Failed to delete blog:', error); }
  };

  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                blogs={blogs}
                currentUser={currentUser}
                isLoggedIn={isLoggedIn}
                viewMode={viewMode}
                setViewMode={setViewMode}
                postFilter={postFilter}
                setPostFilter={setPostFilter}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleAddNewClick={handleAddNewClick}
                handleLogout={handleLogout}
                handleEditClick={handleEditClick}
                showDeleteModalHandler={(id) => setDeletingBlogId(id)}
              />
            } 
          />
          <Route path="/blog/:id" element={<SinglePostPage />} />
        </Routes>

        {/* --- MODALS AND FORMS --- */}
        {isBlogFormVisible && (
          <BlogForm onBlogAdded={blogSavedHandler} onClose={() => setIsBlogFormVisible(false)} existingBlog={editingBlog} />
        )}
        {isLoginPageVisible && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            onClose={() => setIsLoginPageVisible(false)}
            onNavigateToRegister={() => { setIsLoginPageVisible(false); setIsRegisterPageVisible(true); }}
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
    </BrowserRouter>
  );
}

export default App;