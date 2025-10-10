const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await pool.query('SELECT * FROM blogData ORDER BY id DESC');
    res.json(blogs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new blog
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const newBlog = await pool.query(
      'INSERT INTO blogData (title, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [title, description, image_url]
    );
    res.json(newBlog.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT (Update) a blog
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    let image_url;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    let updateQuery;
    let queryParams;

    if (image_url) {
      updateQuery = 'UPDATE blogData SET title = $1, description = $2, image_url = $3 WHERE id = $4 RETURNING *';
      queryParams = [title, description, image_url, id];
    } else {
      updateQuery = 'UPDATE blogData SET title = $1, description = $2 WHERE id = $3 RETURNING *';
      queryParams = [title, description, id];
    }

    const updatedBlog = await pool.query(updateQuery, queryParams);
    if (updatedBlog.rows.length === 0) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json(updatedBlog.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a blog
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query('DELETE FROM blogData WHERE id = $1 RETURNING *', [id]);
    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json({ msg: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;