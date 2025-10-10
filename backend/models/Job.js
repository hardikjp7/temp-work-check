const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  responsibilities: [String],
  location: {
    city: String,
    country: String,
    remote: { type: Boolean, default: false }
  },
  workplaceType: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    required: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Entry level', 'Mid-Senior level', 'Director', 'Executive'],
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  skills: [String],
  benefits: [String],
  applicationDeadline: Date,
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resume: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    appliedAt: { type: Date, default: Date.now }
  }],
  numberOfPositions: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for search and filtering
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ employmentType: 1, workplaceType: 1, experienceLevel: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
