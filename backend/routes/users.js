const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'firstName lastName profilePicture headline currentPosition')
      .populate('experience.company')
      .populate('recommendations.from', 'firstName lastName profilePicture headline');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'headline', 'about', 'location', 'industry',
      'currentPosition', 'company', 'website', 'phone', 'profilePicture',
      'coverPhoto', 'openToWork', 'openToHire', 'jobPreferences', 'privacySettings'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/users/experience
// @desc    Add experience
// @access  Private
router.post('/experience', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.experience.unshift(req.body);
    await user.save();

    res.json({ success: true, experience: user.experience });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/experience/:expId
// @desc    Update experience
// @access  Private
router.put('/experience/:expId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const experience = user.experience.id(req.params.expId);
    
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    Object.assign(experience, req.body);
    await user.save();

    res.json({ success: true, experience: user.experience });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/users/experience/:expId
// @desc    Delete experience
// @access  Private
router.delete('/experience/:expId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.experience.pull(req.params.expId);
    await user.save();

    res.json({ success: true, experience: user.experience });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/users/education
// @desc    Add education
// @access  Private
router.post('/education', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.education.unshift(req.body);
    await user.save();

    res.json({ success: true, education: user.education });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/education/:eduId
// @desc    Update education
// @access  Private
router.put('/education/:eduId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const education = user.education.id(req.params.eduId);
    
    if (!education) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    Object.assign(education, req.body);
    await user.save();

    res.json({ success: true, education: user.education });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/users/education/:eduId
// @desc    Delete education
// @access  Private
router.delete('/education/:eduId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.education.pull(req.params.eduId);
    await user.save();

    res.json({ success: true, education: user.education });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/users/skills
// @desc    Add skill
// @access  Private
router.post('/skills', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.skills.push({ name: req.body.name, endorsements: [] });
    await user.save();

    res.json({ success: true, skills: user.skills });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/users/:userId/skills/:skillId/endorse
// @desc    Endorse a skill
// @access  Private
router.post('/:userId/skills/:skillId/endorse', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const skill = user.skills.id(req.params.skillId);
    
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check if already endorsed
    const alreadyEndorsed = skill.endorsements.some(
      e => e.user.toString() === req.userId
    );

    if (alreadyEndorsed) {
      return res.status(400).json({ success: false, message: 'Already endorsed this skill' });
    }

    skill.endorsements.push({ user: req.userId });
    await user.save();

    res.json({ success: true, skills: user.skills });
  } catch (error) {
    console.error('Endorse skill error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/suggestions
// @desc    Get connection suggestions
// @access  Private
router.get('/suggestions/people', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    
    // Find users not in connections and not the current user
    const suggestions = await User.find({
      _id: { 
        $ne: req.userId,
        $nin: currentUser.connections
      }
    })
    .select('firstName lastName profilePicture headline currentPosition company')
    .limit(10);

    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
