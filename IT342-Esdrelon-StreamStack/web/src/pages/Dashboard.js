import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // OBSERVER PATTERN

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, subscribe } = useAuth(); // OBSERVER
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const categories = ['All', 'Action', 'Drama', 'Sci-Fi', 'Crime', 'Thriller'];

  // OBSERVER PATTERN: Subscribe to auth changes
  useEffect(() => {
    const observer = {
      onAuthChange: (action, data) => {
        console.log('Auth state changed:', action, data);
        
        if (action === 'LOGOUT') {
          navigate('/login');
        }
      }
    };
    
    const unsubscribe = subscribe(observer);
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [subscribe, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout(); // Notifies all observers
  };

  if (!user) return null;

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)'
      }}
    >
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">StreamStack</h1>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-600">Logged in as</p>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                  </div>
                  <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to StreamStack
          </h2>
          <p className="text-blue-100">Discover thousands of movies</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-blue-600 font-bold'
                  : 'bg-white/20 text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-[2/3] bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                <span className="text-5xl">🎬</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm">Movie Card</h3>
                <p className="text-xs text-gray-500">Coming soon...</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;