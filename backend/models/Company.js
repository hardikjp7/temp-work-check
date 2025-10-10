const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: String,
  coverImage: String,
  tagline: String,
  description: String,
  industry: String,
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']
  },
  companyType: {
    type: String,
    enum: ['Public Company', 'Private Company', 'Startup', 'Non-profit', 'Government', 'Self-employed']
  },
  founded: Number,
  website: String,
  headquarters: {
    city: String,
    country: String
  },
  locations: [{
    city: String,
    country: String,
    address: String
  }],
  specialties: [String],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
