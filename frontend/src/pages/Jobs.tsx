import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types';
import api from '@/lib/api';
import { MapPin, Briefcase, DollarSign, Clock, Bookmark, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employmentType: '',
    workplaceType: '',
    experienceLevel: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/save`);
      toast.success('Job saved');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Job title, keywords, or company"
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="City or country"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
              <select
                value={filters.employmentType}
                onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workplace Type</label>
              <select
                value={filters.workplaceType}
                onChange={(e) => setFilters({ ...filters, workplaceType: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                className="input-field"
              >
                <option value="">All Levels</option>
                <option value="Entry level">Entry level</option>
                <option value="Mid-Senior level">Mid-Senior level</option>
                <option value="Director">Director</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Search Jobs
          </button>
        </form>
      </div>

      {/* Job Listings */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {jobs.length} Jobs Found
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No jobs found. Try adjusting your filters.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-4 flex-1">
                    {job.company.logo ? (
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-16 h-16 rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {job.title}
                      </Link>
                      <Link to={`/companies/${job.company._id}`} className="text-gray-700 hover:underline">
                        {job.company.name}
                      </Link>
                      
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location.city}, {job.location.country}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.employmentType}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.workplaceType}
                        </div>
                        {job.salary && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()} {job.salary.currency}/{job.salary.period}
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>

                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Posted {formatDate(job.createdAt)} • {job.applicants?.length || 0} applicants
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveJob(job._id)}
                    className="ml-4 p-2 text-gray-400 hover:text-primary-600"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
