export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  profilePicture?: string;
  coverPhoto?: string;
  about?: string;
  location?: {
    city?: string;
    country?: string;
  };
  industry?: string;
  currentPosition?: string;
  company?: string;
  website?: string;
  phone?: string;
  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  skills?: Skill[];
  connections?: User[];
  followers?: User[];
  following?: User[];
  recommendations?: Recommendation[];
  languages?: Language[];
  openToWork?: boolean;
  openToHire?: boolean;
  jobPreferences?: JobPreferences;
  isVerified?: boolean;
  isPremium?: boolean;
  privacySettings?: PrivacySettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  employmentType?: string;
}

export interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
  description?: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Skill {
  _id?: string;
  name: string;
  endorsements?: Array<{
    user: string;
    date: string;
  }>;
}

export interface Recommendation {
  from: User;
  text: string;
  relationship: string;
  date: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface JobPreferences {
  jobTitles?: string[];
  locations?: string[];
  workplaceType?: string[];
  jobTypes?: string[];
}

export interface PrivacySettings {
  profileVisibility?: 'public' | 'connections' | 'private';
  showEmail?: boolean;
  showPhone?: boolean;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  }>;
  likes: string[];
  comments: Comment[];
  shares: Array<{
    user: string;
    date: string;
  }>;
  visibility: 'public' | 'connections' | 'private';
  hashtags?: string[];
  mentions?: string[];
  isRepost?: boolean;
  originalPost?: Post;
  repostComment?: string;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  likes: string[];
  replies?: Array<{
    user: User;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  title: string;
  company: Company;
  postedBy: User;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  location: {
    city?: string;
    country?: string;
    remote?: boolean;
  };
  workplaceType: string;
  employmentType: string;
  experienceLevel: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  skills?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  applicants?: Array<{
    user: User;
    resume?: string;
    coverLetter?: string;
    status: string;
    appliedAt: string;
  }>;
  numberOfPositions?: number;
  isActive: boolean;
  views: number;
  savedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  companyType?: string;
  founded?: number;
  website?: string;
  headquarters?: {
    city?: string;
    country?: string;
  };
  locations?: Array<{
    city?: string;
    country?: string;
    address?: string;
  }>;
  specialties?: string[];
  admins?: User[];
  followers?: User[];
  employees?: User[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  attachments?: Array<{
    type: string;
    url: string;
  }>;
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type: string;
  content: string;
  link?: string;
  relatedPost?: Post;
  relatedJob?: Job;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  _id: string;
  requester: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  updatedAt: string;
}
