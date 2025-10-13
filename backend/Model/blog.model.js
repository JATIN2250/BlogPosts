const pool = require('../db'); // Your database connection

// Get all blogs with their author's username
exports.findAll = async () => {
    const result = await pool.query(
        `SELECT ub.id, ub.title, ub.description, ub.image_url, ub.user_id, ui.username
         FROM userBlog ub
         JOIN userInfo ui ON ub.user_id = ui.user_id
         ORDER BY ub.id DESC`
    );
    return result.rows;
};

// Get one blog by its ID with the author's username
exports.findById = async (id) => {
    const result = await pool.query(
        `SELECT ub.id, ub.title, ub.description, ub.image_url, ub.user_id, ui.username
         FROM userBlog ub
         JOIN userInfo ui ON ub.user_id = ui.user_id
         WHERE ub.id = $1`,
        [id]
    );
    return result.rows[0]; // Returns a single blog object or undefined
};

// Create a new blog post
exports.create = async ({ title, description, imageUrl, userId }) => {
    const result = await pool.query(
        'INSERT INTO userBlog (title, description, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, imageUrl, userId]
    );
    return result.rows[0];
};

// Update an existing blog post
exports.update = async (id, { title, description, imageUrl }) => {
    // This dynamic query handles both cases: with and without a new image
    let updateQuery;
    let queryParams;

    if (imageUrl) {
        updateQuery = 'UPDATE userBlog SET title = $1, description = $2, image_url = $3 WHERE id = $4 RETURNING *';
        queryParams = [title, description, imageUrl, id];
    } else {
        updateQuery = 'UPDATE userBlog SET title = $1, description = $2 WHERE id = $3 RETURNING *';
        queryParams = [title, description, id];
    }

    const result = await pool.query(updateQuery, queryParams);
    return result.rows[0];
};

// Delete a blog post by its ID
exports.remove = async (id) => {
    await pool.query('DELETE FROM userBlog WHERE id = $1', [id]);
};