import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateItem.css';
import { Link } from 'react-router-dom';
import logo from './logo.png';


const CreateItem = () => {
  const [item, setItem] = useState({
    bio: '',
    interest1: '',
    interest2: '',
    interest3: '',
    interest4: '',
    interest5: '',
    image: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user_id cookie
    const userIdFromCookie = document.cookie.split('; ').find(row => row.startsWith('user_id='));

    if (userIdFromCookie) {
      const userId = userIdFromCookie.split('=')[1];
      setItem((prevItem) => ({ ...prevItem, user_id: userId }));
    }
  }, []);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a POST request to the server to add the item
    fetch('/createprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Item added:', data);
        navigate('/items');
        // Clear the form
        setItem({
          bio: '',
          interest1: '',
          interest2: '',
          interest3: '',
          interest4: '',
          interest5: '',
          image: '',
        });
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  return (
    <div><header className="navbar navbar-expand-sm bg-dark">
    <Link to="/forums">
      <img className="logo" src={logo} alt="icon" />
    </Link>
    <Link to="/forums" className="nav-link">| forums</Link>
    <Link to="/createforum" className="nav-link">| create forum</Link>
    <Link to="/profile" className="nav-link">| profile</Link>
  </header>
    <div className="container">
      
      <h2 className="title">Create a profile</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Bio:
          <textarea name="bio" className="form-textarea" value={item.bio} onChange={handleChange} />
        </label>
        <label className="form-label">
          Interest 1:
          <input type="text" name="interest1" className="form-input" value={item.interest1} onChange={handleChange} />
        </label>
        <label className="form-label">
          Interest 2:
          <input type="text" name="interest2" className="form-input" value={item.interest2} onChange={handleChange} />
        </label>
        <label className="form-label">
          Interest 3:
          <input type="text" name="interest3" className="form-input" value={item.interest3} onChange={handleChange} />
        </label>
        <label className="form-label">
          Interest 4:
          <input type="text" name="interest4" className="form-input" value={item.interest4} onChange={handleChange} />
        </label>
        <label className="form-label">
          Interest 5:
          <input type="text" name="interest5" className="form-input" value={item.interest5} onChange={handleChange} />
        </label>
        <label className="form-label">
          profile Image:
          <input type="text" name="image" className="form-input" value={item.image} onChange={handleChange} />
        </label>
        <button type="submit" className="form-button">
          Create Item
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateItem;
