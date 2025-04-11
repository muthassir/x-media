import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { FaHeart, FaRegHeart} from "react-icons/fa"

const Posts = ({ posts, userData, handleDeletePost, filteredPost, handleLikePost }) => {
  const [menuOpen, setMenuOpen] = useState({});


  const toggleMenu = (postId) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };



  return (
    <div className="bg-slate-400 mt-4 p-4">
      <h2>Posts</h2>
      <div>
        {filteredPost.length > 0 ? (
          filteredPost.map((post) => {
            const originalIndex = posts.findIndex((p) => p._id === post._id);
            const isLiked = userData && post.likes.some(id => id)  // Check if user liked
            // const isLiked = userData && post.likes.some(id => id.toString() === userData._id); 
            console.log("post name",post.username , "Post:", post._id, "Likes:", post.likes, "IsLiked:", isLiked); 
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
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="text-red-500 mr-2 cursor-pointer heart"
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      {isLiked ? <FaHeart /> :<FaRegHeart /> }
                    </button>
                    <span>{post.likes.length} {post.likes.length <= 1 ? "Like" : "Likes"}</span>
                  </div>
                )}


{/* delete */}
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
                        {/* <Link to={`/editpost/${post._id}`} >
                          <button className="menu-icon" title="edit">
                            <MdEdit />
                          </button>
                        </Link> */}
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
