const pool = require('../db'); // Your database connection

// Find a user by their email address (used for registration check)
exports.findByEmail = async (email) => {
    const result = await pool.query('SELECT user_id, username, email FROM userInfo WHERE email = $1', [email]);
    return result.rows[0]; // Returns user data or undefined
};

// Find a user by email, but include the hashed password (used for login)
exports.findByEmailWithPassword = async (email) => {
    const result = await pool.query('SELECT * FROM userInfo WHERE email = $1', [email]);
    return result.rows[0]; // Returns full user data including password
};

// Find a user by their ID (used after token verification)
exports.findById = async (id) => {
    const result = await pool.query('SELECT user_id, username, email FROM userInfo WHERE user_id = $1', [id]);
    return result.rows[0]; // Returns user data without the password
};

// Create a new user in the database
exports.create = async ({ username, email, hashedPassword }) => {
    const result = await pool.query(
        'INSERT INTO userInfo (username, email, userpass) VALUES ($1, $2, $3) RETURNING user_id, username, email',
        [username, email, hashedPassword]
    );
    return result.rows[0]; // Returns the newly created user's data
};