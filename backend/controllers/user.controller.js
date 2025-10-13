// Import necessary modules
const User = require('../Model/user.model.js'); // The "kitchen" for user data
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ## Controller to REGISTER a new user
// Handles the logic for the POST /api/users/register route.
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user via the model
        const newUser = await User.create({
            username,
            email,
            hashedPassword
        });

        res.status(201).json({
            msg: 'User registration successful!',
            user: newUser,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// ## Controller to LOGIN a user
// Handles the logic for the POST /api/users/login route.
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findByEmailWithPassword(email);
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.userpass);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        // 3. If credentials are valid, create and return a JWT
        const payload = {
            user: {
                id: user.user_id,
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
};

// ## Controller to GET the authenticated user's data
// Handles the logic for the GET /api/users/auth route.
exports.getAuthenticatedUser = async (req, res) => {
    try {
        // The auth middleware has already verified the token and added `req.user`
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};