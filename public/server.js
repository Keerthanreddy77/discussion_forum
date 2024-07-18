const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the current directory
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Keerthan@3685',
  database: 'passion_connect',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint for user sign-in
app.post('/signin', (req, res) => {
  console.log('sign in received');
  const { email, password } = req.body;

  // Query the database to find the user with the given email
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if a user with the given email exists
    if (results.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.Password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (bcryptResult) {
        // Passwords match, user is authenticated
        res.cookie('user_id', user.UserID, { maxAge: 3600000, httpOnly: true });
        return res.redirect('/forums');
      } else {
        // Passwords do not match
        res.status(401).json({ error: 'Authentication failed' });
      }
    });
  });
});

// Endpoint for user sign-up
app.post('/register', (req, res) => {
  console.log('sign up received');
  const { username, email, password } = req.body;

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Insert the new user into the database
    db.query(
      'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash],
      (insertErr) => {
        if (insertErr) {
          console.error('Error inserting user into database:', insertErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.redirect('/');
      }
    );
  });
});

app.post('/createforum', (req, res) => {
  const { title, description } = req.body;
  console.log(req.body);

  // Validation: Check if title and description are provided
  if (!title || !description) {
    return res.status(400).json({ error: 'Please provide both title and description for the forum.' });
  }

  // Insert the new forum into the database
  const query = 'INSERT INTO forum (title, description) VALUES (?, ?)';
  db.query(query, [title, description], (error, result) => {
    if (error) {
      console.error('Error creating forum:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Respond with the created forum
      res.status(201).json({ message: 'Forum created successfully' });
    }
  });
});

app.post('/createprofile', (req, res) => {
  const newItem = req.body;
  console.log(newItem);
  const user_id = req.cookies.user_id;

  // Insert the new item into the "Items" table (use your database connection)
  // For simplicity, we're assuming you have a `db` object for the database connection
  db.query(
    'INSERT INTO profile (UserID, Bio, interest1, interest2, interest3, interest4, interest5, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      user_id,
      newItem.bio,
      newItem.interest1,
      newItem.interest2,
      newItem.interest3,
      newItem.interest4,
      newItem.interest5,
      newItem.image,
    ],
    (insertErr, results) => {
      if (insertErr) {
        console.error('Error adding item to the database:', insertErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      // console.log(results);
      res.redirect('/');
    }
  );
});

// Fetch user profile from the database
app.get('/profile', (req, res) => {
  const user_id = req.cookies.user_id;

  // Fetch user profile from the database
  db.query('SELECT * FROM profile WHERE UserID = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const userProfile = results[0];
    res.json(userProfile);
  });
});

// Fetch all forums from the database
app.get('/forums/posts', (req, res) => {
  const forumname = req.cookies.ForumID;
  // Validate if the forumname is provided
  console.log(forumname);
  // Fetch forum posts based on the provided ForumID (assuming ForumID is the same as forumname)
  const query = 'SELECT * FROM forumpost WHERE ForumID = ?';
  db.query(query, [forumname], (error, results) => {
    if (error) {
      console.error('Error fetching forum posts:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Ensure forumPosts is an array before responding
    const formattedForumPosts = Array.isArray(results) ? results : [];
    console.log(formattedForumPosts);
    // Respond with the fetched forum posts
    res.cookie('ForumID', forumname, { maxAge: 3600000, httpOnly: true });
    res.status(200).json(formattedForumPosts);
  });
});
  
  // Handle GET request to fetch forum posts based on ForumID
  app.get('/api/forums/posts', (req, res) => {
    const forumname = req.cookies.ForumID;
  
    // Validate if the forumname is provided
    if (!forumname) {
      return res.status(400).json({ error: 'Please provide the forumname.' });
    }
  
    // Fetch forum posts based on the provided ForumID (assuming ForumID is the same as forumname)
    const query = 'SELECT * FROM forumpost WHERE ForumID = ?';
    db.query(query, [forumname], (error, results) => {
      if (error) {
        console.error('Error fetching forum posts:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Ensure forumPosts is an array before responding
      const formattedForumPosts = Array.isArray(results) ? results : [];
      console.log(formattedForumPosts);
  
      // Respond with the fetched forum posts
      res.cookie('ForumID', forumname, { maxAge: 3600000, httpOnly: true });
      res.status(200).json(formattedForumPosts);
    });
  });
  
  // Handle POST request to add a new post to the forum
  app.post('/api/forums/addpost', (req, res) => {
    const { content } = req.body;
    const user_id = req.cookies.user_id;
    const ForumID = req.cookies.ForumID;
  
    // Validate if the forumname and content are provided
    if (!ForumID || !content || !user_id) {
      return res.status(400).json({ error: 'Please provide ForumID, content, and user_id.' });
    }
  
    // Insert the new post into the database
    const query = 'INSERT INTO forumpost (ForumID, Content, UserID) VALUES (?, ?, ?)';
    db.query(query, [ForumID, content, user_id], (error, result) => {
      if (error) {
        console.error('Error adding post:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Respond with the created post
      res.status(201).json({ message: 'Post added successfully', postId: result.insertId });
    });
  });
  
  // Endpoint to set a cookie with ForumID
  app.post('/setcookie', (req, res) => {
    console.log(req.body);
    const ForumID = req.body.ForumID;
    res.cookie('ForumID', ForumID, { maxAge: 3600000, httpOnly: true });
  });
  
  const port = 3002;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  