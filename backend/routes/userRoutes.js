const express = require("express");
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Middleware for token verification

// ## POST /api/users/register
// Registers a new user.
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if a user with that email already exists
        const user = await pool.query('SELECT * FROM userInfo WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const newUser = await pool.query(
            'INSERT INTO userInfo (username, email, userpass) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [username, email, hashedPassword]
        );

        // Send a success response
        res.status(201).json({
            msg: 'User registration successful!',
            user: newUser.rows[0],
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// ## POST /api/users/login
// Authenticates a user and returns a JWT.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await pool.query('SELECT * FROM userInfo WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        // Compare the submitted password with the stored hashed password
        const isValidPassword = await bcrypt.compare(password, user.rows[0].userpass);
        if (!isValidPassword) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        // If credentials are valid, create and return a signed JWT
        const payload = {
            user: {
                id: user.rows[0].user_id,
            },
        };

        jwt.sign(
            payload,
            process.env.JW_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// ## GET /api/users/auth
// Gets the logged-in user's data using the token from the header.
router.get('/auth', auth,async (req, res) => {
    try {
        // The 'auth' middleware verifies the token and adds the user's ID to req.user
        const user = await pool.query('SELECT user_id, username, email FROM userInfo WHERE user_id = $1', [
            req.user.id
        ]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;