const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, media, visibility, hashtags, mentions } = req.body;

    const post = new Post({
      author: req.userId,
      content,
      media,
      visibility,
      hashtags,
      mentions
    });

    await post.save();
    await post.populate('author', 'firstName lastName profilePicture headline');

    // Create notifications for mentions
    if (mentions && mentions.length > 0) {
      const notifications = mentions.map(userId => ({
        recipient: userId,
        sender: req.userId,
        type: 'mention',
        content: `mentioned you in a post`,
        relatedPost: post._id
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/posts/feed
// @desc    Get user feed
// @access  Private
router.get('/feed', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      $or: [
        { author: req.userId },
        { author: { $in: req.user.connections } },
        { visibility: 'public' }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName profilePicture headline currentPosition')
    .populate('comments.user', 'firstName lastName profilePicture')
    .populate('originalPost');

    const total = await Post.countDocuments({
      $or: [
        { author: req.userId },
        { author: { $in: req.user.connections } },
        { visibility: 'public' }
      ]
    });

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName profilePicture headline currentPosition')
      .populate('comments.user', 'firstName lastName profilePicture')
      .populate('comments.replies.user', 'firstName lastName profilePicture');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment impressions
    post.impressions += 1;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { content, media, visibility } = req.body;
    post.content = content || post.content;
    post.media = media || post.media;
    post.visibility = visibility || post.visibility;

    await post.save();
    await post.populate('author', 'firstName lastName profilePicture headline');

    res.json({ success: true, post });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.userId);

      // Create notification
      if (post.author.toString() !== req.userId) {
        await Notification.create({
          recipient: post.author,
          sender: req.userId,
          type: 'post_like',
          content: 'liked your post',
          relatedPost: post._id
        });
      }
    }

    await post.save();

    res.json({ success: true, likes: post.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = {
      user: req.userId,
      text: req.body.text,
      likes: [],
      replies: []
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'firstName lastName profilePicture');

    // Create notification
    if (post.author.toString() !== req.userId) {
      await Notification.create({
        recipient: post.author,
        sender: req.userId,
        type: 'post_comment',
        content: 'commented on your post',
        relatedPost: post._id
      });
    }

    res.json({ success: true, comments: post.comments });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/share
// @desc    Share/repost a post
// @access  Private
router.post('/:id/share', auth, async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);

    if (!originalPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const repost = new Post({
      author: req.userId,
      content: req.body.comment || '',
      isRepost: true,
      originalPost: originalPost._id,
      repostComment: req.body.comment,
      visibility: req.body.visibility || 'public'
    });

    await repost.save();
    originalPost.shares.push({ user: req.userId });
    await originalPost.save();

    // Create notification
    if (originalPost.author.toString() !== req.userId) {
      await Notification.create({
        recipient: originalPost.author,
        sender: req.userId,
        type: 'post_share',
        content: 'shared your post',
        relatedPost: originalPost._id
      });
    }

    await repost.populate('author', 'firstName lastName profilePicture headline');
    await repost.populate('originalPost');

    res.status(201).json({ success: true, post: repost });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
