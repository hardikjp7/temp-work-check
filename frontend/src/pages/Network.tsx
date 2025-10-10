import { useState, useEffect } from 'react';
import { User, Connection } from '@/types';
import api from '@/lib/api';
import { Link } from 'react-router-dom';
import { UserPlus, UserCheck, X, Loader2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Network() {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'suggestions'>('connections');
  const [connections, setConnections] = useState<User[]>([]);
  const [requests, setRequests] = useState<Connection[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'connections') {
        const response = await api.get('/connections');
        setConnections(response.data.connections);
      } else if (activeTab === 'requests') {
        const response = await api.get('/connections/requests');
        setRequests(response.data.requests);
      } else {
        const response = await api.get('/users/suggestions/people');
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.put(`/connections/${requestId}/accept`);
      toast.success('Connection request accepted');
      fetchData();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.put(`/connections/${requestId}/reject`);
      toast.success('Connection request rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await api.post('/connections/request', { recipientId: userId });
      toast.success('Connection request sent');
      setSuggestions(suggestions.filter(s => s._id !== userId));
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('connections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'connections'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Connections ({connections.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'suggestions'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suggestions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <>
              {activeTab === 'connections' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.length === 0 ? (
                    <p className="text-gray-500 col-span-2 text-center py-8">No connections yet</p>
                  ) : (
                    connections.map((connection) => (
                      <div key={connection._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Link to={`/profile/${connection._id}`}>
                          {connection.profilePicture ? (
                            <img
                              src={connection.profilePicture}
                              alt={`${connection.firstName} ${connection.lastName}`}
                              className="w-16 h-16 rounded-full"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                              {getInitials(connection.firstName, connection.lastName)}
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/profile/${connection._id}`} className="font-semibold text-gray-900 hover:underline truncate block">
                            {connection.firstName} {connection.lastName}
                          </Link>
                          <p className="text-sm text-gray-600 truncate">{connection.headline}</p>
                          <p className="text-xs text-gray-500">{connection.currentPosition}</p>
                        </div>
                        <Link to={`/messages?user=${connection._id}`} className="btn-secondary text-sm">
                          Message
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending requests</p>
                  ) : (
                    requests.map((request) => (
                      <div key={request._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <Link to={`/profile/${request.requester._id}`}>
                          {request.requester.profilePicture ? (
                            <img
                              src={request.requester.profilePicture}
                              alt={`${request.requester.firstName} ${request.requester.lastName}`}
                              className="w-16 h-16 rounded-full"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                              {getInitials(request.requester.firstName, request.requester.lastName)}
                            </div>
                          )}
                        </Link>
                        <div className="flex-1">
                          <Link to={`/profile/${request.requester._id}`} className="font-semibold text-gray-900 hover:underline">
                            {request.requester.firstName} {request.requester.lastName}
                          </Link>
                          <p className="text-sm text-gray-600">{request.requester.headline}</p>
                          {request.message && (
                            <p className="text-sm text-gray-700 mt-2 italic">"{request.message}"</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className="btn-primary flex items-center"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            className="btn-secondary flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.length === 0 ? (
                    <p className="text-gray-500 col-span-3 text-center py-8">No suggestions available</p>
                  ) : (
                    suggestions.map((suggestion) => (
                      <div key={suggestion._id} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                        <Link to={`/profile/${suggestion._id}`}>
                          {suggestion.profilePicture ? (
                            <img
                              src={suggestion.profilePicture}
                              alt={`${suggestion.firstName} ${suggestion.lastName}`}
                              className="w-20 h-20 rounded-full mx-auto"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-xl mx-auto">
                              {getInitials(suggestion.firstName, suggestion.lastName)}
                            </div>
                          )}
                        </Link>
                        <Link to={`/profile/${suggestion._id}`} className="block mt-3">
                          <h3 className="font-semibold text-gray-900 hover:underline">
                            {suggestion.firstName} {suggestion.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{suggestion.headline}</p>
                        </Link>
                        <button
                          onClick={() => handleConnect(suggestion._id)}
                          className="mt-4 btn-secondary w-full flex items-center justify-center"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
