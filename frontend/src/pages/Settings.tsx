import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <p className="text-gray-600">Settings page - Configure your account preferences</p>
    </div>
  );
}
