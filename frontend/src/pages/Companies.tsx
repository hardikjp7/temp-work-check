import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '@/types';
import api from '@/lib/api';
import { Building2, Users, MapPin, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get(`/companies?search=${searchQuery}`);
      setCompanies(response.data.companies);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleFollow = async (companyId: string) => {
    try {
      await api.post(`/companies/${companyId}/follow`);
      toast.success('Company followed');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to follow company');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length === 0 ? (
          <div className="col-span-3 card p-12 text-center text-gray-500">
            No companies found
          </div>
        ) : (
          companies.map((company) => (
            <div key={company._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
              {company.coverImage ? (
                <img
                  src={company.coverImage}
                  alt={company.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>
              )}
              
              <div className="p-6 -mt-12">
                <Link to={`/companies/${company._id}`}>
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-20 h-20 rounded border-4 border-white bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded border-4 border-white bg-white flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </Link>

                <Link to={`/companies/${company._id}`} className="block mt-4">
                  <h3 className="text-lg font-bold text-gray-900 hover:underline">
                    {company.name}
                  </h3>
                  {company.tagline && (
                    <p className="text-sm text-gray-600 mt-1">{company.tagline}</p>
                  )}
                </Link>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {company.industry && (
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {company.industry}
                    </div>
                  )}
                  {company.companySize && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {company.companySize} employees
                    </div>
                  )}
                  {company.headquarters && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {company.headquarters.city}, {company.headquarters.country}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {company.followers?.length || 0} followers
                  </span>
                  <button
                    onClick={() => handleFollow(company._id)}
                    className="btn-secondary text-sm"
                  >
                    Follow
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
