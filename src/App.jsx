// src/App.js (Fully Updated)

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import ConfirmationModal from './components/ConfirmationModel';
import Pagination from './components/Pagination'; // Import Pagination
import ViewToggle from './components/ViewToggle'; // Import ViewToggle

const POSTS_PER_PAGE = 6;

function App() {
  const [blogs, setBlogs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlogId, setDeletingBlogId] = useState(null);

  // New states for pagination and view
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  // --- Form and Modal Handlers (same as before) ---
  const showFormHandler = (blog = null) => {
    setEditingBlog(blog);
    setIsFormVisible(true);
  };
  const hideFormHandler = () => {
    setIsFormVisible(false);
    setEditingBlog(null);
  };
  const blogSavedHandler = () => {
    hideFormHandler();
    fetchBlogs();
  };
  const showDeleteModalHandler = (id) => setDeletingBlogId(id);
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
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header onAddNew={() => showFormHandler()} />
      <main className="container mx-auto p-4 pt-32">
        {/* View Toggle Buttons */}
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        
        <BlogList
          blogs={currentPosts} // Pass only the blogs for the current page
          onEdit={showFormHandler}
          onDelete={showDeleteModalHandler}
          viewMode={viewMode} // Pass viewMode to BlogList
        />

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {isFormVisible && (
        <BlogForm onBlogAdded={blogSavedHandler} onClose={hideFormHandler} existingBlog={editingBlog} />
      )}
      {deletingBlogId && (
        <ConfirmationModal message="Are you sure you want to delete this blog post?" onConfirm={confirmDeleteHandler} onCancel={hideDeleteModalHandler} />
      )}
    </div>
  );
}

export default App;