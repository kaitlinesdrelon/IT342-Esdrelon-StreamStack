import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: ''
  });
  const [listCounts, setListCounts] = useState({
    watchlist: 0,
    watched: 0,
    favorites: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstname: user.firstname || '',
        lastname: user.lastname || ''
      });

      // Fetch user list counts
      fetchListCounts();
    }
  }, [user]);

  const fetchListCounts = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:8080/api/user-lists/${user.userId}`);
      setListCounts(response.data.counts || { watchlist: 0, watched: 0, favorites: 0 });
    } catch (error) {
      console.error('Error fetching list counts:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      console.log('Updating user:', user.userId, formData);
      const response = await axios.put(
        `http://localhost:8080/api/user/${user.userId}`,
        formData
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        updateUser(response.data.data);
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.data.message || 'Failed to update profile');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (err) {
      console.error('Update error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)'
      }}
    >
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <img 
                src="/logo.png" 
                alt="StreamStack" 
                className="h-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="flex items-center" style={{ display: 'none' }}>
                <span className="text-xl">🎬 StreamStack</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.firstname} {user.lastname}</h1>
                <p className="text-blue-100">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-500 rounded-full text-sm">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-green-700 font-semibold">✓ {successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-semibold">✗ {errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition-all"
                  required
                />
              </div>

              <div className="flex gap-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400"
                    >
                      {isLoading ? 'Saving...' : '✓ Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: user.username,
                          email: user.email,
                          firstname: user.firstname,
                          lastname: user.lastname
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
                    >
                      ✕ Cancel
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* Account Statistics */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{listCounts.watched}</p>
                  <p className="text-sm text-gray-600 mt-1">Movies Watched</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{listCounts.watchlist}</p>
                  <p className="text-sm text-gray-600 mt-1">Watchlist</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">{listCounts.favorites}</p>
                  <p className="text-sm text-gray-600 mt-1">Favorites</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-800">
                <strong>💾 Real-Time Database:</strong> All changes are saved directly to PostgreSQL database and synced across all devices.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;