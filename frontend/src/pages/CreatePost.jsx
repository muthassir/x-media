import React from "react";
import logo from "../assets/InShot_20250406_155054086.png";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";

export const CreatePost = () => {
  const [loading, setLoading] = useState(false)

  const localHost = "http://localhost:3000";
  // const localHost  = "https://x-media-bvtm.onrender.com"

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()
  const [error, setError] = useState("");
  // Cloudinary Config
  const cloudName = "de13d1vnc";
  const uploadPreset = "my_upload_preset";
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  // CRUD Handlers
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { timeout: 10000 }
      );
      return response.data.secure_url;
    } catch (err) {
      setLoading(false); // Stop loading on image upload failure
      throw new Error("Image upload failed");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${localHost}/api/auth/posts`,
        { content: newPost, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data.post, ...posts]);
      setNewPost("");
      setImage(null);
      setLoading(false); // Stop loading on successful post creation
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.response?.data?.message || "Failed to create post");
      setLoading(false); // Stop loading on post creation failure
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={handlePostSubmit} className="create-post">
        <h1 className="text-center ">Whats On Your Mind...</h1>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Add a caption..."
          required
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
          disabled={loading}
        />
        <div className="flex flex-col">
        <button type="submit" className={`send rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </form>
      <Link to="/dashboard">
        <button className="rounded back">
          <IoArrowBack size={30} />
        </button>
      </Link>
      <img src={logo} alt="logo" className="logo" />
    </div>
  );
};
