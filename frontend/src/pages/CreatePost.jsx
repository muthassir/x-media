import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


export const CreatePost = () => {
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
         'https://x-media-bvtm.onrender.com',
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data.post, ...posts]); // Add new post to the top
      setNewPost(""); // Clear input
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
      <h1>X-Media</h1>
      <h1 className='text-center '>Write Something...</h1>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Write your post..."
                            required
                            style={{ width: '100%', padding: '10px', minHeight: '100px', marginTop: '15px', border: '2px solid black' }}
                        />
                       <div className='flex flex-col'>
                       <button
                            type="submit"
                            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', marginTop: '10px', cursor: "pointer"}}
                        >
                            Post
                        </button>
                    
                       </div>
                    </form>
                    <Link to="/dashboard"><button
                    
                    style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', marginTop: '10px', cursor: "pointer"}}
                >
                    Back
                </button></Link>  
                    </div>
  )
}
