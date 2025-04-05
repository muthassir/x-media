import React from 'react'
import {MdDelete} from "react-icons/md"

const Posts = ({posts, handleDeletePost, userData}) => {
  return (
    <div>
    <h2>Posts</h2>
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{post.username}:</strong> {post.content}
            </p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
            {userData.username === post.username && (
              <button
                onClick={() => handleDeletePost(post._id)}
                style={{
                  padding: "5px 10px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  margin: "4px",
                  borderRadius: "5px",
                }}
              >
                <MdDelete />
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No posts yet</p>
      )}
    </div>
  </div>
  )
}

export default Posts