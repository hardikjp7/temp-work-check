import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Company } from '@/types';
import api from '@/lib/api';
import { Building2, Users, MapPin, Globe, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      setCompany(response.data.company);
    } catch (error) {
      toast.error('Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!company) {
    return <div className="card p-8 text-center">Company not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        {company.coverImage ? (
          <img src={company.coverImage} alt={company.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        )}
        
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-16">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-32 h-32 rounded border-4 border-white bg-white" />
            ) : (
              <div className="w-32 h-32 rounded border-4 border-white bg-white flex items-center justify-center">
                <Building2 className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            {company.tagline && <p className="text-lg text-gray-600 mt-1">{company.tagline}</p>}
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              {company.industry && (
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {company.industry}
                </div>
              )}
              {company.companySize && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {company.companySize} employees
                </div>
              )}
              {company.headquarters && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {company.headquarters.city}, {company.headquarters.country}
                </div>
              )}
              {company.founded && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Founded {company.founded}
                </div>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary-600 hover:underline">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {company.description && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{company.description}</p>
        </div>
      )}
    </div>
  );
}
