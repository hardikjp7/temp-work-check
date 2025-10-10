const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Post = require('../models/Post');

// @route   GET /api/search
// @desc    Global search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(q, 'i');
    const results = {};

    if (type === 'all' || type === 'people') {
      results.people = await User.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { headline: searchRegex },
          { currentPosition: searchRegex }
        ]
      })
      .select('firstName lastName profilePicture headline currentPosition company location')
      .limit(parseInt(limit))
      .skip(skip);
    }

    if (type === 'all' || type === 'jobs') {
      results.jobs = await Job.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { skills: searchRegex }
        ],
        isActive: true
      })
      .populate('company', 'name logo')
      .limit(parseInt(limit))
      .skip(skip);
    }

    if (type === 'all' || type === 'companies') {
      results.companies = await Company.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { industry: searchRegex }
        ]
      })
      .select('name logo tagline industry followers')
      .limit(parseInt(limit))
      .skip(skip);
    }

    if (type === 'all' || type === 'posts') {
      results.posts = await Post.find({
        $or: [
          { content: searchRegex },
          { hashtags: searchRegex }
        ],
        visibility: 'public'
      })
      .populate('author', 'firstName lastName profilePicture headline')
      .limit(parseInt(limit))
      .skip(skip);
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
