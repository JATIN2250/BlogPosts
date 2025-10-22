import React, { useState, useEffect } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const BlogForm = ({ onBlogAdded, onClose, existingBlog }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title);
      setDescription(existingBlog.description);
      if (existingBlog.image_url) {
        setImagePreview(`https://backend.blogocean.publicvm.com${existingBlog.image_url}`);
      }
    }
  }, [existingBlog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    const isEditing = !!existingBlog;
    const url = isEditing ? `https://backend.blogocean.publicvm.com/api/blogs/${existingBlog.id}` : 'https://backend.blogocean.publicvm.com/api/blogs';
    const method = isEditing ? 'PUT' : 'POST';

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, { method,
        headers:{'x-auth-token':token,}, body: formData });
      if (!response.ok) throw new Error('Something went wrong');
      onBlogAdded();
      onClose();
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">{existingBlog ? 'Edit Blog' : 'Add New Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
            <label htmlFor="image-upload" className="flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" /> : <div className="text-center"><FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" /><p className="mt-2 text-sm text-gray-600">Click to upload an image</p></div>}
            </label>
            <input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Save Blog</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;