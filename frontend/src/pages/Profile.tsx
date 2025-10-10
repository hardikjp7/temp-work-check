import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '@/types';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Briefcase, Mail, Phone, Globe, Calendar, Edit, UserPlus, MessageSquare } from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data.user);
      setIsConnected(response.data.user.connections?.some((c: User) => c._id === currentUser?._id));
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await api.post('/connections/request', { recipientId: userId });
      toast.success('Connection request sent!');
    } catch (error) {
      toast.error('Failed to send connection request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <div className="card p-8 text-center">User not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-16">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-primary-600 flex items-center justify-center text-white text-4xl font-semibold">
                {getInitials(user.firstName, user.lastName)}
              </div>
            )}
            
            <div className="mt-4 sm:mt-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-lg text-gray-600">{user.headline}</p>
                </div>
                
                {!isOwnProfile && (
                  <div className="flex space-x-3">
                    {!isConnected && (
                      <button onClick={handleConnect} className="btn-primary flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </button>
                    )}
                    <button className="btn-secondary flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </button>
                  </div>
                )}
                
                {isOwnProfile && (
                  <button className="btn-secondary flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                {user.location?.city && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location.city}, {user.location.country}
                  </div>
                )}
                {user.currentPosition && (
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {user.currentPosition} at {user.company}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {formatDate(user.createdAt || '')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      {user.about && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{user.about}</p>
        </div>
      )}

      {/* Experience */}
      {user.experience && user.experience.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Experience</h2>
          <div className="space-y-6">
            {user.experience.map((exp) => (
              <div key={exp._id} className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {user.education && user.education.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="space-y-6">
            {user.education.map((edu) => (
              <div key={edu._id} className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                  <p className="text-gray-700">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(edu.startDate).getFullYear()} -{' '}
                    {edu.current ? 'Present' : new Date(edu.endDate!).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <div key={skill._id} className="px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                {skill.endorsements && skill.endorsements.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    {skill.endorsements.length} endorsements
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
