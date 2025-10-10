import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Search,
  Building2,
  LogOut,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { getInitials } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Search */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="hidden sm:block font-bold text-xl text-gray-900">ProConnect</span>
            </Link>
            
            <form onSubmit={handleSearch} className="ml-6 flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </form>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1 hidden sm:block">Home</span>
            </Link>
            
            <Link to="/network" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1 hidden sm:block">Network</span>
            </Link>
            
            <Link to="/jobs" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <Briefcase className="w-6 h-6" />
              <span className="text-xs mt-1 hidden sm:block">Jobs</span>
            </Link>
            
            <Link to="/messages" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs mt-1 hidden sm:block">Messages</span>
            </Link>
            
            <Link to="/notifications" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <Bell className="w-6 h-6" />
              <span className="text-xs mt-1 hidden sm:block">Notifications</span>
            </Link>

            <Link to="/companies" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <Building2 className="w-6 h-6" />
              <span className="text-xs mt-1 hidden sm:block">Companies</span>
            </Link>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user && getInitials(user.firstName, user.lastName)}
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
