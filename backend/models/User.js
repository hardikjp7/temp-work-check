const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
  }
});

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  grade: String,
  description: String
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: Date,
  expirationDate: Date,
  credentialId: String,
  credentialUrl: String
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  headline: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    country: String
  },
  industry: String,
  currentPosition: String,
  company: String,
  website: String,
  phone: String,
  dateOfBirth: Date,
  experience: [experienceSchema],
  education: [educationSchema],
  certifications: [certificationSchema],
  skills: [{
    name: String,
    endorsements: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now }
    }]
  }],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  recommendations: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    relationship: String,
    date: { type: Date, default: Date.now }
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native']
    }
  }],
  openToWork: {
    type: Boolean,
    default: false
  },
  openToHire: {
    type: Boolean,
    default: false
  },
  jobPreferences: {
    jobTitles: [String],
    locations: [String],
    workplaceType: [{
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid']
    }],
    jobTypes: [{
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public'
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
