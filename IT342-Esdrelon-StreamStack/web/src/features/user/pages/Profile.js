import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/context/AuthContext';
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

  // Sync formData logic
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstname: user.firstname || '',
        lastname: user.lastname || ''
      });
    }
  }, [user, isEditing]);

  const fetchListCounts = useCallback(async () => {
    const userId = user?.user_id || user?.userId;
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/user-lists/${userId}`);
      setListCounts({
        watchlist: response.data.watchlist?.length || 0,
        watched: response.data.watched?.length || 0,
        favorites: response.data.favorites?.length || 0
      });
    } catch (error) {
      console.error('Error fetching list counts:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchListCounts();
  }, [user, fetchListCounts]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveToDatabase = async (e) => {
    if (e) e.preventDefault(); 
    
    // Safety check: Don't save if no changes
    if (
      formData.username === user.username &&
      formData.email === user.email &&
      formData.firstname === user.firstname &&
      formData.lastname === user.lastname
    ) {
      setIsEditing(false);
      return;
    }

    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const userId = user.user_id || user.userId;
      const response = await axios.put(`http://localhost:8080/api/user/${userId}`, formData);

      if (response.status === 200) {
        const updatedUser = response.data.data || response.data;
        updateUser(updatedUser);
        
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false); 
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)' }}>
      <header className="bg-gray-800 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="text-white flex items-center font-bold hover:text-blue-200">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-white flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-blue-400">
              {user.firstname?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.firstname} {user.lastname}</h1>
              <p className="opacity-80">{user.email}</p>
            </div>
          </div>

          <div className="p-8">
            {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg font-bold border-l-4 border-green-500">✓ {successMessage}</div>}
            {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg font-bold border-l-4 border-red-500">✕ {errorMessage}</div>}

            <form onSubmit={handleSaveToDatabase} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-xl outline-none transition-all ${!isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-400 text-black'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-xl outline-none transition-all ${!isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-400 text-black'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-xl outline-none transition-all ${!isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-400 text-black'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-xl outline-none transition-all ${!isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-400 text-black'}`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <button
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md transition-all active:scale-95 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Saving...' : '✓ Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setErrorMessage('');
                      }}
                      className="flex-1 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all active:scale-95"
                    >
                      ✕ Cancel
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* RESTORED STATS SECTION */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t pt-8">
              <div className="text-center bg-blue-50 p-4 rounded-2xl">
                <p className="text-2xl font-black text-blue-600">{listCounts.watched}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Movies Watched</p>
              </div>
              <div className="text-center bg-green-50 p-4 rounded-2xl">
                <p className="text-2xl font-black text-green-600">{listCounts.watchlist}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Watchlist</p>
              </div>
              <div className="text-center bg-purple-50 p-4 rounded-2xl">
                <p className="text-2xl font-black text-purple-600">{listCounts.favorites}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Favorites</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;