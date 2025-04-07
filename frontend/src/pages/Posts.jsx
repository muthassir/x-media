import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { useState } from "react";
import Editpost from "./Editpost";


const Posts = ({ posts, handleDeletePost, userData }) => {
  const [switching, setSwitching] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null)
 

  const handleEditPost = () => setEditing(true);

 
  return (
    <div className="bg-slate-400 mt-4 p-4">
      <h2>Posts</h2>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="posts bg-slate-300 rounded m-2 p-3">
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
              <Editpost editing={editing} post={post} error={error} setError={setError}/>

              {userData.username === post.username && (
                <div>
                  <button
                    className="menu-icon"
                    onClick={() => {
                      setSwitching(!switching);
                    }}
                  >
                    <CiMenuKebab />
                  </button>
                  {switching && (
                    <div className="menu-icon-box mt-1 ">
                      <button
                        className="menu-icon"
                        onClick={() => handleDeletePost(post._id)}
                        title="delete"
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="menu-icon"
                        onClick={handleEditPost}
                        title="edit"
                      >
                        <MdEdit />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
