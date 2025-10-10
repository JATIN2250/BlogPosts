import React, { useEffect, useState } from "react";
import Card from "./card";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://api.pexels.com/v1/search?query=technology&per_page=6", {
      headers: {
        Authorization:
          "HBw7zCo3SJZN5AHqpRwphLEtLY9bv0Vfmue3KP6h8CTQ3pMQHV2n1O8P",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Convert Pexels photos to blog-like objects
        const blogData = data.photos.map((photo, index) => ({
          id: photo.id,
          image: photo.src.medium,
          description: `This is blog ${index + 1} about ${photo.alt}`,
        }));
        setBlogs(blogData);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Card key={blog.id} img={blog.image} description={blog.description} />
      ))}
    </div>
  );
};

export default PexelsBlogPage;
