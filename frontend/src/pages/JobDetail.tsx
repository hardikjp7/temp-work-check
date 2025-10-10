import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job } from '@/types';
import api from '@/lib/api';
import { MapPin, Briefcase, DollarSign, Clock, Users, Eye, Calendar, Building2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${jobId}/apply`, { coverLetter });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      fetchJob();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!job) {
    return <div className="card p-8 text-center">Job not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          {job.company.logo ? (
            <img src={job.company.logo} alt={job.company.name} className="w-20 h-20 rounded" />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <Link to={`/companies/${job.company._id}`} className="text-lg text-gray-700 hover:underline">
              {job.company.name}
            </Link>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
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
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {job.experienceLevel}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {job.views} views
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Posted {formatDate(job.createdAt)}
              </div>
            </div>

            {job.salary && (
              <div className="mt-4 flex items-center text-lg font-semibold text-green-600">
                <DollarSign className="w-5 h-5 mr-1" />
                {job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()} {job.salary.currency}/{job.salary.period}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="btn-primary"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Job Description */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
      </div>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for {job.title}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit for this role..."
                  className="input-field resize-none"
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="btn-secondary"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="btn-primary flex items-center"
                  disabled={applying}
                >
                  {applying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
