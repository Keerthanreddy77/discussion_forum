// ForumDiscussion.js

import React, { useEffect, useState } from 'react';

const ForumDiscussion = ({ forumname }) => {
  const [forumPosts, setForumPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    // Fetch forum posts from the backend when the component mounts
    fetchForumPosts();
  }, [forumname]);

  const fetchForumPosts = async () => {
    try {
      // Send a GET request to fetch forum posts based on the forumname
      const response = await fetch(`/api/forums/posts?forumname=${forumname}`);
      const data = await response.json();

      if (response.ok) {
        // Set the retrieved forum posts to the state
        setForumPosts(data);
      } else {
        console.error('Error fetching forum posts:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error.message || 'Unknown error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new post
      const response = await fetch('/api/forums/addpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPostContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // After posting, fetch the updated forum posts
        fetchForumPosts();
        // Clear the input field
        setNewPostContent('');
      } else {
        console.error('Error adding post:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding post:', error.message || 'Unknown error');
    }
  };

  return (
    <div className='forum-discussion'>
      <h2>Forum Discussion</h2>
      <ul>
        {forumPosts.map((post) => (
          <li key={post.PostID}>
            <strong>User ID:</strong> {post.UserID}, <strong>Content:</strong> {post.Content},{' '}
            <strong>Timestamp:</strong> {post.CreatedDate}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder='Enter your post...'
        />
        <button type='submit'>Post</button>
      </form>
    </div>
  );
};

export default ForumDiscussion;
