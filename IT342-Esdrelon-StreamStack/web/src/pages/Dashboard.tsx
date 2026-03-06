import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  userId: number;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userStr));
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
    }}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎬</span>
              </div>
              <h1 className="text-xl font-bold text-white">StreamStack</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <p className="text-sm text-blue-100">Welcome, <span className="font-semibold text-white">{user.username}</span></p>
              </div>
              <button className="px-4 py-2 bg-white/90 hover:bg-white text-blue-600 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/20">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi'].map((category) => (
            <button
              key={category}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full font-medium transition-all duration-200 border border-white/30"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Movie Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:scale-105 transition-transform duration-200">
              <div className="aspect-[2/3] bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                <span className="text-6xl">🎬</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">Movie Card</h3>
                <p className="text-sm text-gray-500">Coming soon...</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Info Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">👤</span>
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-600 mb-1">Username</label>
              <p className="text-lg text-gray-800 font-medium">{user.username}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-600 mb-1">Email</label>
              <p className="text-lg text-gray-800 font-medium">{user.email}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-600 mb-1">Role</label>
              <p className="text-lg text-gray-800 font-medium">{user.role}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-600 mb-1">Status</label>
              <p className="text-lg text-green-600 font-medium">● Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;