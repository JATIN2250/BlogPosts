const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');
const path = require('path');
const auth = require('../middleware/auth'); // Auth middleware ko import karein

// Multer config (for image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ## GET all blogs with author's name
// Yeh route public hai aur sabhi blogs ko unke author ke naam ke saath fetch karega.
router.get('/', async (req, res) => {
  try {
    // userInfo table se JOIN karke username nikalein
    const blogs = await pool.query(
      `SELECT ub.id, ub.title, ub.description, ub.image_url, ub.user_id, ui.username
       FROM userBlog ub
       JOIN userInfo ui ON ub.user_id = ui.user_id
       ORDER BY ub.id DESC`
    );
    res.json(blogs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ## POST a new blog (Protected)
// Sirf logged-in user hi naya blog post kar sakta hai.
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const user_id = req.user.id; // Logged-in user ki ID token se lein

    const newBlog = await pool.query(
      'INSERT INTO userBlog (title, description, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, image_url, user_id]
    );

    res.json(newBlog.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ## PUT (Update) a blog (Protected & Author-only)
// Sirf post ka asli author hi use edit kar sakta hai.
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const user_id_from_token = req.user.id;

    // 1. Author ko verify karein
    const blog = await pool.query('SELECT user_id FROM userBlog WHERE id = $1', [id]);
    if (blog.rows.length === 0) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.rows[0].user_id !== user_id_from_token) {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    // 2. Agar author sahi hai, to update karein
    let image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    let updateQuery;
    let queryParams;

    if (image_url) {
      updateQuery = 'UPDATE userBlog SET title = $1, description = $2, image_url = $3 WHERE id = $4 RETURNING *';
      queryParams = [title, description, image_url, id];
    } else {
      updateQuery = 'UPDATE userBlog SET title = $1, description = $2 WHERE id = $3 RETURNING *';
      queryParams = [title, description, id];
    }

    const updatedBlog = await pool.query(updateQuery, queryParams);
    res.json(updatedBlog.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ## DELETE a blog (Protected & Author-only)
// Sirf post ka asli author hi use delete kar sakta hai.
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id_from_token = req.user.id;

    // 1. Author ko verify karein
    const blog = await pool.query('SELECT user_id FROM userBlog WHERE id = $1', [id]);
    if (blog.rows.length === 0) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.rows[0].user_id !== user_id_from_token) {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    // 2. Agar author sahi hai, to delete karein
    await pool.query('DELETE FROM userBlog WHERE id = $1', [id]);
    res.json({ msg: 'Blog deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;