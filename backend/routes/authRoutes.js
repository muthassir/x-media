
const express = require('express');
const router = express.Router();
const User = require('../models/userModel.js');
const Post = require('../models/Post.js');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware.js');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ email, username, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            token,
            user: { email: user.email, username: user.username },
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const pass = await User.findOne({password});
        if (!pass) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: { email: user.email, username: user.username },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Data (Protected)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ email: user.email, username: user.username });
    } catch (error) {
        console.error('Get user data error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Post (Protected)
router.post('/posts', authMiddleware, async (req, res) => {
    const { content, imageUrl } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = new Post({
            content,
            imageUrl: imageUrl || '', // Default to empty string if not provided
            user: req.user.userId,
            username: user.username
        });
        await post.save();

        res.status(201).json({ message: 'Post created', post });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit Post (Protected)
router.put('/posts/:id', authMiddleware, async (req, res) => {
    const { content } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this post' });
        }

        post.content = content;
        await post.save();

        res.json({ message: 'Post updated', post });
    } catch (error) {
        console.error('Edit post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Post (Protected)
router.delete('/posts/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user owns the post
        if (post.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await Post.deleteOne({ _id: req.params.id });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// // likes

router.post("/posts/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        let userId;
        if (req.user && req.user._id) {
            userId = req.user._id;
        } else if (req.user && req.user.userId) {
            userId = req.user.userId;
        } else {
            return res.status(401).json({ message: "Unauthorized" }); // Or handle appropriately
        }

        const likedIndex = post.likes.indexOf(userId);

        if (likedIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likedIndex, 1);
        }

        await post.save();
        res.json({ post });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// comments




module.exports = router;