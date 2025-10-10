/**
 * API Service File for Blog Posts
 * This file contains all the functions for making HTTP requests to the backend API.
 */

import axios from "axios";

// The base URL for all blog-related API endpoints.
const API_URL = "http://localhost:5000/api/blogs";

/**
 * Fetches a paginated list of blogs from the backend.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of blogs per page.
 * @returns {Promise} An axios promise containing the response data.
 */
export const fetchBlogs = (page = 1, limit = 6) => {
  return axios.get(`${API_URL}?page=${page}&limit=${limit}`);
};

/**
 * Uploads a new image for an existing blog post.
 * @param {string|number} id - The ID of the blog to update.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise} An axios promise.
 */
export const updateBlogImage = (id, imageFile) => {
  const formData = new FormData();
  // IMPORTANT: The key here must be "image" to match the backend (upload.single('image')).
  formData.append("image", imageFile);

  // IMPORTANT: The URL must match the backend route /api/blogs/image/:id
  return axios.put(`${API_URL}/image/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Adds a new blog post, including an optional image.
 * @param {FormData} formData - The form data containing title, description, and an optional image file.
 * @returns {Promise} An axios promise.
 */
export const addBlog = (formData) => {
  return axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Updates a blog's title and description.
 * @param {string|number} id - The ID of the blog to update.
 * @param {object} updatedData - An object containing the new title and description.
 * @returns {Promise} An axios promise.
 */
export const updateBlog = (id, updatedData) => {
  return axios.put(`${API_URL}/${id}`, updatedData, {
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Deletes a blog by its ID.
 * @param {string|number} id - The ID of the blog to delete.
 * @returns {Promise} An axios promise.
 */
export const deleteBlog = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

