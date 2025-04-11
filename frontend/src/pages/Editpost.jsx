import React from 'react'
import { useState } from 'react';
import { usePosts } from '../context/PostContext';


const Editpost = ({editing}) => {
    const {post, error} = usePosts()
    const [editedContent, setEditedContent] = useState(post.content);

    // edit post
  const handleSaveEdit = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.put(
            `${localHost}/api/auth/posts/${post._id}`,
            { content: editedContent },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(response.data.post)
        setEditing(false)
        setError('')
        navigate("/")
    } catch (error) {
        console.error('Error editing post:', error)
        setError(error.response?.data?.message || 'Failed to edit post')
        navigate("/")
    }
}

const handleCancelEdit = () => {
    setEditing(false);
    setEditedContent(post.content);
    setError('')
    navigate("/")
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
                    {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
                </div> : null}
    </div>
  )
}

export default Editpost