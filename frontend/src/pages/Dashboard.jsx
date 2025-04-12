import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Posts from "./Posts";
import { IoMdRefresh } from "react-icons/io";
import axios from "axios";
import Loading from "../components/Loading";
import Profile from "./Profile";

const Dashboard = () => {
  const localHost = "http://localhost:3000";
  // const localHost = "https://x-media-bvtm.onrender.com";

  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Post State
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserData(JSON.parse(storedUser));

        const userResponse = await axios.get(`${localHost}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);
        localStorage.setItem("user", JSON.stringify(userResponse.data));

        const postsResponse = await axios.get(`${localHost}/api/auth/posts`, {
          headers: { Authorization: `Bearer ${token}` }, // Add token here too
        });
        setPosts(postsResponse.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        setError(error.response?.data?.message || "Error loading data");
        if (error.response?.status === 401) {
          handleLogout();
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // search post

  const [searchTerm, setsearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setsearchTerm(event.target.value);
  };
  const filteredPost = posts.filter((post, index) => {
    const displyIndex = posts.length - index;
    return String(displyIndex).includes(searchTerm);
  });

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setPosts([]);
    navigate("/");
  };

  // delete post
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${localHost}/api/auth/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error.response?.data?.message || "Failed to delete post");
    }
  };

  // like functions
  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${localHost}/api/auth/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );
    } catch (error) {
      console.error("Error liking post:", error);
      setError(error.response?.data?.message || "Failed to like post");
    }
  };
  // comments

  // ends here
  return (
    <div>
      <h1 className="text-center mt-4 text-yellow-400">Postify</h1>
      {loading ? (
        <div className=" flex justify-center items-center">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-red-700 text-center">{error}</p>
      ) : userData ? (
        <>
          <div className="dashboard">
            {/* profile component */}
            <Profile
              userData={userData}
              switching={switching}
              setSwitching={setSwitching}
              handleLogout={handleLogout}
            />

            {/* create post button */}
            <Link to="/createpost">
              <button className="btn mt-4">Create Post</button>
            </Link>

            {/* Posts refresh */}
            <button
              onClick={() => navigate("/")}
              title="refresh"
              className="mt-2 text-yellow-400 flex justify-center items-center cursor-pointer"
            >
              <IoMdRefresh size={30} />
            </button>

            {/* Search Bar */}
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Enter number (e.g., 1, 2)"
                style={{
                  color: "yellow",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid yellow",
                  marginTop: "4px",
                }}
              />
            </div>
            {/* POSTS */}
            <Posts
              posts={posts}
              userData={userData}
              handleDeletePost={handleDeletePost}
              filteredPost={filteredPost}
              handleLikePost={handleLikePost}
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
