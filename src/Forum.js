// Forum.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forum = ({ forumID, title, description }) => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    // Redirect to the /forums/posts?forumname=${ForumID} route
    const response = fetch('/setcookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ForumID: forumID,
      }),
    });
    navigate(`/forums/posts?forumname=${forumID}`);
  };

  return (
    <div className="forum-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="join-button" onClick={handleJoinClick}>
        Join
      </button>
    </div>
  );
};

export default Forum;
