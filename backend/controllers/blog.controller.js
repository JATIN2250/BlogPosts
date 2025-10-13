// Import the Model (the "kitchen" staff that handles the database)
const Blog = require('../Model/blog.model.js');

// ## Controller to get ALL blogs
// Handles the logic for the GET /api/blogs route.
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// ## Controller to get a SINGLE blog by its ID
// Handles the logic for the GET /api/blogs/:id route.
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// ## Controller to CREATE a new blog
// Handles the logic for the POST /api/blogs route.
exports.createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const userId = req.user.id; // From the auth middleware

        const newBlogData = { title, description, imageUrl, userId };
        const newBlog = await Blog.create(newBlogData);
        
        res.status(201).json(newBlog);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// ## Controller to UPDATE a blog
// Handles the logic for the PUT /api/blogs/:id route.
exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userIdFromToken = req.user.id;

        // --- Security Check: Verify Ownership ---
        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        if (existingBlog.user_id !== userIdFromToken) {
            return res.status(403).json({ msg: 'Authorization denied. You are not the owner of this post.' });
        }
        // --- End Security Check ---

        const { title, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const updatedBlogData = { title, description, imageUrl };
        const updatedBlog = await Blog.update(blogId, updatedBlogData);

        res.json(updatedBlog);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// ## Controller to DELETE a blog
// Handles the logic for the DELETE /api/blogs/:id route.
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userIdFromToken = req.user.id;

        // --- Security Check: Verify Ownership ---
        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        if (existingBlog.user_id !== userIdFromToken) {
            return res.status(403).json({ msg: 'Authorization denied. You are not the owner of this post.' });
        }
        // --- End Security Check ---

        await Blog.remove(blogId);
        res.json({ msg: 'Blog deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};