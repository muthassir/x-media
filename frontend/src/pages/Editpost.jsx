import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Editpost = ({editing, post, setEditing, setError, errors}) => {
    const [editedContent, setEditedContent] = useState(post.content);
    const navigate = useNavigate()
    
  const baseURLS = "https://x-media-bvtm.onrender.com"
//   const localHost = "http://localhost:3000"


    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${baseURLS}/api/auth/posts/${post._id}`,
                { content: editedContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // onPostUpdated(response.data.post);
            setEditing(false);
            setError('');
            navigate("/")
        } catch (error) {
            console.error('Error editing post:', error);
            setError(error.response?.data?.message || 'Failed to edit post');
            navigate("/")
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditedContent(post.content);
        setError('');
    };


  return (
    <div>
          {editing ? <div style={{ width: '100%' }}>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={{ width: '100%', padding: '10px', minHeight: '50px' }}
                        className='border-2 border-black'
                    />
                    <button
                        onClick={handleSaveEdit}
                        style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', marginRight: '10px' }}
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        style={{ padding: '5px 10px', background: '#6c757d', color: 'white', border: 'none' }}
                    >
                        Cancel
                    </button>
                    {errors && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
                </div> : null}
    </div>
  )
}

export default Editpost