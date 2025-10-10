import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import { Bookmark, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        <div className="px-4 pb-4 -mt-8">
          <Link to={`/profile/${user?._id}`}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-16 h-16 rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-white bg-primary-600 flex items-center justify-center text-white text-xl font-semibold">
                {user && getInitials(user.firstName, user.lastName)}
              </div>
            )}
          </Link>
          <Link to={`/profile/${user?._id}`} className="block mt-2">
            <h3 className="font-semibold text-gray-900 hover:underline">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{user?.headline || 'Add a headline'}</p>
          </Link>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              <span className="font-semibold text-primary-600">{user?.connections?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Profile views</span>
              <span className="font-semibold text-primary-600">0</span>
            </div>
          </div>
          {user?.openToWork && (
            <div className="mt-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 font-medium">Open to work</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
        <div className="space-y-2">
          <Link to="/jobs/user/saved" className="flex items-center text-sm text-gray-600 hover:text-primary-600">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved Jobs
          </Link>
          <Link to="/network" className="flex items-center text-sm text-gray-600 hover:text-primary-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Grow Your Network
          </Link>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
        <div className="space-y-3">
          {['#RemoteWork', '#AI', '#WebDevelopment', '#DataScience', '#CloudComputing'].map((tag) => (
            <Link
              key={tag}
              to={`/search?q=${encodeURIComponent(tag)}`}
              className="block text-sm text-primary-600 hover:underline"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
