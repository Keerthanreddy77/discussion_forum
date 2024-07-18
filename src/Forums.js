// Forums.js

import React, { useEffect, useState } from 'react';
import Forum from './Forum';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const Forums = () => {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    // Fetch forums from the backend when the component mounts
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch('/api/forums');
      const data = await response.json();

      if (response.ok) {
        // Set the retrieved forums to the state
        setForums(data);
      } else {
        console.error('Error fetching forums:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching forums:', error.message || 'Unknown error');
    }
  };

  return (
    <div>
      <header className="navbar navbar-expand-sm bg-dark">
    <Link to="/forums">
      <img className="logo" src={logo} alt="icon" />
    </Link>
    <Link to="/forums" className="nav-link">| forums</Link>
    <Link to="/createforum" className="nav-link">| create forum</Link>
    <Link to="/profile" className="nav-link">| profile</Link>
  </header>
      <h2>All Forums</h2>
      {forums.map((forum) => (
        <Forum
          key={forum.ForumID}
          forumID={forum.ForumID}
          title={forum.Title}
          description={forum.Description}
        />
      ))}
    </div>
  );
};

export default Forums;
