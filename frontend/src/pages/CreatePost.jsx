import React from 'react'
import logo from "../assets/InShot_20250406_155054086.png"
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


export const CreatePost = () => {
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null); // State for the image file
  const navigate = useNavigate()
  const baseURLS = "https://x-media-bvtm.onrender.com"
  // const localHost = "http://localhost:3000"

  const cloudName = 'de13d1vnc'
  const uploadPreset = 'my_upload_preset'

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            { timeout: 10000 } // Add timeout to catch slow network issues
        );
        return response.data.secure_url; // Return the uploaded image URL
    } catch (err) {
        throw new Error('Image upload failed');
    }
};



  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {

      let imageUrl = '';
            // Upload image to Cloudinary if one is selected
            if (image) {
                imageUrl = await uploadImageToCloudinary(image);
            }


      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURLS}/api/auth/posts`,
        { content: newPost, imageUrl }, // Send both content and imageUrl
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data.post, ...posts]); // Add new post to the top
      setNewPost(""); // Clear input
      // setImage(null);
       // Reset image input
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.response?.data?.message || "Failed to create post");
    }
  };
  return (
    <div className='flex flex-col justify-center items-center'>
    <form onSubmit={handlePostSubmit}  style={{
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
     marginTop: "120px"
    }}>
      <h1 className='text-center '>Whats On Your Mind...</h1>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Write your post..."
                            required
                            style={{ width: '100%', padding: '10px', minHeight: '100px', marginTop: '15px', border: '2px solid black' }}
                        />
                        <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                   
                />
                       <div className='flex flex-col'>
                       <button
                            type="submit"
                            className='rounded'
                            style={{ padding: '10px 20px', background: 'yellow', border: 'none', marginTop: '10px', cursor: "pointer"}}
                        >
                            Post
                        </button>
                    
                       </div>
                    </form>
                    <Link to="/dashboard"><button
                    className='rounded'
                    style={{ padding: '10px 20px', background: '#d21f3c', border: 'none', marginTop: '10px', cursor: "pointer"}}
                >
                    Back
                </button></Link>  
                <img src={logo} alt="logo" className='logo' />           
                    </div>
  )
}
