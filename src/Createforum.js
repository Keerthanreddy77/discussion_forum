// CreateForum.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
const CreateForum = ({ onCreateForum }) => {
  const [forumTitle, setForumTitle] = useState('');
  const [forumDescription, setForumDescription] = useState('');

  const handleTitleChange = (e) => {
    setForumTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setForumDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if title and description are not empty
    if (forumTitle.trim() === '' || forumDescription.trim() === '') {
      alert('Please provide both title and description for the forum.');
      return;
    }

    // Create a new forum object
    const newForum = {
      title: forumTitle,
      description: forumDescription,
    };

    try {
      // Send a POST request to the backend to create a new forum
      const response = await fetch('/createforum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForum),
      });

      const data = await response.json();

      if (response.ok) {
        // Notify the parent component about the created forum
        if (typeof onCreateForum === 'function') {
          onCreateForum(data.forum);
        }

        // Clear the form fields after submission
        setForumTitle('');
        setForumDescription('');
      } else {
        console.error('Error creating forum:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating forum:', error.message || 'Unknown error');
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
    <div className="create-forum-container">
      <h2>Create a New Forum</h2>
      <form onSubmit={handleSubmit} className="forum-form">
        <div className="form-group">
          <label htmlFor="forumTitle" className="form-label">
            Title:
          </label>
          <input
            type="text"
            id="forumTitle"
            value={forumTitle}
            onChange={handleTitleChange}
            placeholder="Enter forum title"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="forumDescription" className="form-label">
            Description:
          </label>
          <textarea
            id="forumDescription"
            value={forumDescription}
            onChange={handleDescriptionChange}
            placeholder="Enter forum description"
            className="form-textarea"
          />
        </div>
        <button type="submit" className="form-button">
          Create Forum
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateForum;
