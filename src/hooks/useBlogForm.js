import { useState } from "react";

const useBlogForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Reset all fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    resetForm,
  };
};

export default useBlogForm;
