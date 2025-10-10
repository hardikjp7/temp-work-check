const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.userId
    });

    await job.save();
    await job.populate('company postedBy', 'name logo firstName lastName profilePicture');

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      employmentType,
      workplaceType,
      experienceLevel,
      company
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (workplaceType) {
      query.workplaceType = workplaceType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (company) {
      query.company = company;
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('company', 'name logo')
      .populate('postedBy', 'firstName lastName profilePicture');

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description industry companySize website')
      .populate('postedBy', 'firstName lastName profilePicture headline')
      .populate('applicants.user', 'firstName lastName profilePicture headline');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply to a job
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      app => app.user.toString() === req.userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    job.applicants.push({
      user: req.userId,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter
    });

    await job.save();

    // Create notification for job poster
    await Notification.create({
      recipient: job.postedBy,
      sender: req.userId,
      type: 'job_application',
      content: `applied to your job posting: ${job.title}`,
      relatedJob: job._id
    });

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id/applicants/:applicantId
// @desc    Update applicant status
// @access  Private
router.put('/:id/applicants/:applicantId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applicant = job.applicants.id(req.params.applicantId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    applicant.status = req.body.status;
    await job.save();

    res.json({ success: true, applicants: job.applicants });
  } catch (error) {
    console.error('Update applicant error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/save
// @desc    Save/unsave a job
// @access  Private
router.post('/:id/save', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const savedIndex = job.savedBy.indexOf(req.userId);

    if (savedIndex > -1) {
      job.savedBy.splice(savedIndex, 1);
    } else {
      job.savedBy.push(req.userId);
    }

    await job.save();

    res.json({ success: true, isSaved: savedIndex === -1 });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/user/saved
// @desc    Get saved jobs
// @access  Private
router.get('/user/saved', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ savedBy: req.userId })
      .sort({ createdAt: -1 })
      .populate('company', 'name logo')
      .populate('postedBy', 'firstName lastName');

    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
