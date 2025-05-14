const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model');
const Comment = require("../model/comment.model");
const verifyToken = require('../middleware/verifytoken');
const isAdmin = require("../middleware/checkadmin");

// Create a blog post
router.post('/create-post', verifyToken, async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body, author: req.userId });
    await newPost.save();
    res.status(201).send({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send({ message: 'Error creating post' });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (location) query.location = location;

    const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 });

    res.status(200).send(posts)
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send({ message: 'Error fetching posts' });
  }
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "No post available" });
    }

    const comments = await Comment.find({ postId: postId }).populate('user', 'username email');

    res.status(200).send({ post, comments });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send({ message: 'Error fetching post' });
  }
});

// Update a blog post
const mongoose = require('mongoose');

router.patch("/update-post/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send({ message: "Invalid Post ID" });
    }

    const updatedPost = await Blog.findByIdAndUpdate(postId, { ...req.body }, { new: true });

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send({
      message: "Post updated successfully.",
      post: updatedPost
    });

  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send({ message: 'Error updating post' });
  }
});

// Delete a post
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Delete related comments
    await Comment.deleteMany({ postId: postId })

    res.status(200).send({
      message: "Post deleted successfully.",
      post: post
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send({ message: 'Error deleting post' });
  }
});

// Related blogs
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ message: "Post not found" });
    }

    const rating = blog.rating?.toString();
    if (!rating) {
      return res.status(400).send({ message: "Rating is missing in the blog" });
    }

    const relatedPosts = await Blog.find({
      _id: { $ne: id },
      rating: rating
    });

    res.status(200).send(relatedPosts)

  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).send({ message: 'Error fetching related posts' });
  }
});

module.exports = router;
