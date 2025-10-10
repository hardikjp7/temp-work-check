const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');

// @route   POST /api/companies
// @desc    Create a company page
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const company = new Company({
      ...req.body,
      admins: [req.userId]
    });

    await company.save();

    res.status(201).json({ success: true, company });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, industry } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.name = new RegExp(search, 'i');
    }
    if (industry) {
      query.industry = industry;
    }

    const companies = await Company.find(query)
      .sort({ followers: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('admins', 'firstName lastName profilePicture');

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('admins', 'firstName lastName profilePicture headline')
      .populate('followers', 'firstName lastName profilePicture');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (!company.admins.includes(req.userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(company, req.body);
    await company.save();

    res.json({ success: true, company });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/companies/:id/follow
// @desc    Follow/unfollow a company
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const followerIndex = company.followers.indexOf(req.userId);

    if (followerIndex > -1) {
      company.followers.splice(followerIndex, 1);
    } else {
      company.followers.push(req.userId);
    }

    await company.save();

    res.json({ success: true, isFollowing: followerIndex === -1 });
  } catch (error) {
    console.error('Follow company error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
