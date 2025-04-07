import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Posts from "./Posts";
import {CgProfile} from "react-icons/cg"
import { IoMdRefresh} from "react-icons/io"

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseURLS = "https://x-media-bvtm.onrender.com"
  const localHost = "http://localhost:3000"

  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }

        // Fetch user data
        const userResponse = await axios.get(
          `${baseURLS || localHost}/api/auth/user`,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(userResponse.data);
        localStorage.setItem("user", JSON.stringify(userResponse.data));

        // Fetch all posts
        const postsResponse = await axios.get(
          `${baseURLS || localHost}/api/auth/posts`
        );
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Error loading data");
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

 
  // delete
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURLS || localHost}/api/auth/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId)); // Remove deleted post from state
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <h1 className="text-center mt-4 text-yellow-400">Postify</h1>
      {loading ? (
        <p className="mt-4 text-center text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-700 text-center">{error}</p>
      ) : userData ? (
        <>
          <div className="dashboard">
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                 
                }}
              >
                <h3>Dashboard</h3>
                <button onClick={()=>setSwitching(!switching)} className="profileBtn mt-2" title="Account"><CgProfile size={30} /></button>
             {switching &&  <div className="bg-slate-600 rounded m-2 p-2">
              <p className="text-white">
                  <strong>Username:</strong> {userData.username}
                </p>
                <button onClick={handleLogout} className="bg-red-500 rounded p-2 cursor-pointer m-2 text-white"> Logout </button>
              </div>}
              </div>
              {/* Post navigate button */}
             <Link to="/createpost"><button className="btn mt-4">Create Post</button></Link> 

            {/* Posts List */}
            <button onClick={()=>navigate("/")} title="refresh" className="mt-2 text-yellow-400 flex justify-center items-center cursor-pointer"> <IoMdRefresh size={30} /></button>
                <Posts posts={posts} 
                handleDeletePost={handleDeletePost}
                userData={userData}
              />
          </div>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Dashboard;
