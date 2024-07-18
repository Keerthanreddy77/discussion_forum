// Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Fetch user profile data from the server
    fetch('/profile')
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  return (
    <div><header className="navbar navbar-expand-sm bg-dark">
    <Link to="/forums">
      <img className="logo" src={logo} alt="icon" />
    </Link>
    <Link to="/forums" className="nav-link">| forums</Link>
    <Link to="/createforum" className="nav-link">| create forum</Link>
    <Link to="/profile" className="nav-link">| profile</Link>
  </header>
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      <div className="profile-info">
        <img className="profile-image" src={profile.image} alt="User" />

        <div className="profile-details">
          <h3 className="profile-subtitle">Bio:</h3>
          <p className="profile-bio">{profile.Bio}</p>

          <h3 className="profile-subtitle">Interests:</h3>
          <ul className="profile-interests">
            <li>{profile.interest1}</li>
            <li>{profile.interest2}</li>
            <li>{profile.interest3}</li>
            <li>{profile.interest4}</li>
            <li>{profile.interest5}</li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
