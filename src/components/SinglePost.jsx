import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Renamed component for consistency
const SinglePostPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://backend.blogocean.publicvm.com/api/blogs/${id}`);

        if (!response.ok) {
          // Updated error message
          throw new Error('Could not fetch the blog post. It may have been removed.');
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center pt-32">Loading post...</p>;
  if (error) return <p className="text-center pt-32 text-red-500">{error}</p>;
  if (!blog) return <p className="text-center pt-32">Post not found.</p>;

  return (
    <div className="container mx-auto p-4 pt-32 max-w-4xl">
      <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">&larr; Back to all posts</Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {blog.image_url && <img src={`https://backend.blogocean.publicvm.com${blog.image_url}`} alt={blog.title} className='w-full h-96 object-cover' />}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-sm text-gray-500 mb-6">By <span className="font-semibold">{blog.username}</span></p>
          {/* Fixed typo: leading-relaxed */}
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{blog.description}</p>
        </div>
      </div>
    </div>
  );
};

// Updated export name for consistency
export default SinglePostPage;