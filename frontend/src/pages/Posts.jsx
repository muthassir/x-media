import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa";
import { FcComments } from "react-icons/fc";
import axios from "axios";

const Posts = ({
  posts,
  userData,
  handleDeletePost,
  filteredPost,
  handleLikePost,
}) => {
  // toggling comments and menu
  const [menuOpen, setMenuOpen] = useState({});
  const [showComment, setShowComment] = useState({});
  const localHost = "http://localhost:3000";
  const [comments, setComments] = useState({}); 
  const [newComment, setNewComment] = useState({})

  const toggleMenu = (postId) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  const toggleComment = async (postId) => {
    setShowComment((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
    // Fetch comments when the comment section is opened
    if (!showComment[postId]) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${localHost}/api/auth/posts/${postId}/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments((prevState) => ({
          ...prevState,
          [postId]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
        // Handle error (e.g., display a message to the user)
      }
    }
  };
  // share website
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check ou this awesome content  for posting memories!",
          text: "Postify",
          url: "https://x-media-muthassir.netlify.app",
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported on this browser.");
      // Optionally provide a fallback sharing mechanism here
    }
  };
  // comment
 

  const handleCommentChange = (postId, event) => {
    setNewComment((prevState) => ({
      ...prevState,
      [postId]: event.target.value,
    }));
  };
  const handleAddComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const commentText = newComment[postId];
      if (!commentText || commentText.trim() === "") {
        return; // Don't submit empty comments
      }
      const response = await axios.post(
        `${localHost}/api/auth/posts/${postId}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // After successful comment, clear the input and re-fetch comments
      setNewComment((prevState) => ({ ...prevState, [postId]: "" }));
      toggleComment(postId); // This will re-fetch comments
    } catch (error) {
      console.error("Error adding comment:", error);
      // Handle error (e.g., display a message to the user)
    }
  };

  // delete comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${localHost}/api/auth/posts/${postId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the comments state by removing the deleted comment
      setComments((prevState) => ({
        ...prevState,
        [postId]: prevState[postId].filter((comment) => comment._id !== commentId),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Optionally display an error message to the user
    }
  };
  

  return (
    <div className="bg-slate-400 mt-4 p-4">
      <h2>Posts</h2>
      <div>
        {filteredPost.length > 0 ? (
          filteredPost.map((post) => {
            const originalIndex = posts.findIndex((p) => p._id === post._id);
            const isLiked = userData && post.likes.some((id) => id); // Check if user liked
            // console.log("post name",post.username , "Post:", post._id, "Likes:", post.likes, "IsLiked:", isLiked);
            return (
              <div
                key={post._id}
                className="posts bg-slate-300 rounded m-2 p-3"
              >
                <p>{posts.length - originalIndex}</p>
                <p>
                  <strong>{post.username}:</strong> {post.content}
                </p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="rounded h-full justify-center items-center"
                  />
                )}
                <small>{new Date(post.createdAt).toLocaleString()}</small>
                {/* Like Button */}
                {userData && (
                  <div className="mt-2 flex items-center justify-center">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="text-red-500 mr-1 cursor-pointer heart"
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      {isLiked ? (
                        <FaHeart size={30} />
                      ) : (
                        <FaRegHeart size={30} />
                      )}
                    </button>
                    <span>
                      {post.likes.length}
                      {/* {post.likes.length <= 1 ? "Like" : "Likes"} */}
                    </span>
                    {/* comments */}
                    <button
                      onClick={() => toggleComment(post._id)}
                      className="comm ml-3 cursor-pointer heart"
                      title="Comments"
                    >
                      <FcComments size={32} />
                    </button>
                    <span>{comments[post._id]?.length || 0}</span>
                    <button
                      className="ml-3 cursor-pointer heart"
                      title="Share"
                      onClick={handleShare}
                    >
                      <FaShare size={29} />
                    </button>
                  </div>
                )}
                {/* comments */}
                {showComment[post._id] && (
                  <div className="comments ">
                    <h2 className="flex items-center justify-center ">Comments </h2>
                   <div className="overflow-auto border-2 rounded">
                   {comments[post._id]?.length > 0 ? (
                      comments[post._id].map((comment) => (
                        <div key={comment._id} className="bg-slate-200 rounded p-2 mb-1 ">
                          <p className="font-semibold">{comment.username}:</p>
                          <p>{comment.text}</p>
                          <small className="text-gray-600">{new Date(comment.createdAt).toLocaleString()}</small>
                          {userData?.username === comment.username && (                            
                            <button
                              onClick={() => handleDeleteComment(post._id, comment._id)}
                              className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                              title="Delete comment"
                            >
                              <MdDelete size={20} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                   </div>
                    {/* add comment */}
                    <div className="mt-2">
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Add a comment..."
                        value={newComment[post._id] || ""}
                        onChange={(event) => handleCommentChange(post._id, event)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="bg-yellow-500 text-white py-2 px-4 rounded mt-1 hover:bg-yellow-600"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}

                {/* delete post */}
                {userData.username === post.username && (
                  <div>
                    <button
                      className="menu-icon"
                      onClick={() => toggleMenu(post._id)}
                    >
                      <CiMenuKebab />
                    </button>
                    {menuOpen[post._id] && (
                      <div className="menu-icon-box mt-1 ">
                        <button
                          className="menu-icon"
                          onClick={() => handleDeletePost(post._id)}
                          title="delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
