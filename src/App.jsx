import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import ConfirmationModal from './components/ConfirmationModel';
import Pagination from './components/Pagination';
import ViewToggle from './components/ViewToggle';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const POSTS_PER_PAGE = 6;

function App() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isRegisterPageVisible, setIsRegisterPageVisible] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false);
  const [isLoginPageVisible, setIsLoginPageVisible] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // --- Handlers ---
  const handleRegisterPage = ()=>{
    setIsLoginPageVisible(false);
    setIsRegisterPageVisible(true);
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
    if (isLoggedIn) {
      setEditingBlog(blog);
      setIsBlogFormVisible(true);
    } else {
      alert("Please log in to edit posts.");
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginPageVisible(false);
  };

  
  
  const hideLoginPage = () => {
    setIsLoginPageVisible(false);
  };

  const showRegisterPage = ()=>{
    setIsLoginPageVisible(false);
    setIsRegisterPageVisible(true);
  }

  const hideRegisterPage = ()=>{
    setIsRegisterPageVisible(false);
  
  }

  const hideBlogForm = () => {
    setIsBlogFormVisible(false);
    setEditingBlog(null);
  };

  const blogSavedHandler = () => {
    hideBlogForm();
    fetchBlogs();
  };

  const showDeleteModalHandler = (id) => {
     if (isLoggedIn) {
       setDeletingBlogId(id);
     } else {
       alert("Please log in to delete posts.");
     }
  };

  const hideDeleteModalHandler = () => setDeletingBlogId(null);
  
  const confirmDeleteHandler = async () => {
    try {
      await fetch(`http://localhost:5000/api/blogs/${deletingBlogId}`, { method: 'DELETE' });
      hideDeleteModalHandler();
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const currentPosts = blogs.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header onAddNew={handleAddNewClick} />
      
      <main className="container mx-auto p-4 pt-32">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        
        <BlogList
          blogs={currentPosts}
          onEdit={handleEditClick}
          onDelete={showDeleteModalHandler}
          viewMode={viewMode}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {isBlogFormVisible && (
        <BlogForm
          onBlogAdded={blogSavedHandler}
          onClose={hideBlogForm}
          existingBlog={editingBlog}
        />
      )}

      {isLoginPageVisible && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onClose={hideLoginPage}
          onNavigateToRegister = {showRegisterPage}
          
        />
      )}
      {isRegisterPageVisible && (
        <RegisterPage onClose={hideRegisterPage}/>
      )}
      {deletingBlogId && (
        <ConfirmationModal 
            message="Are you sure you want to delete this blog post?" 
            onConfirm={confirmDeleteHandler} 
            onCancel={hideDeleteModalHandler} 
        />
      )}
    </div>
  );
}

export default App;