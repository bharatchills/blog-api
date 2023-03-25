const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

      if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.userId;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
      },
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const authorId = req.user.userId;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({ error: 'You do not have permission to edit this post.' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.user.userId;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({ error: 'You do not have permission to delete this post.' });
    }

    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
