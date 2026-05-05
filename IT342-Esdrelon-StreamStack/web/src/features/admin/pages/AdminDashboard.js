import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/authentication/context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: '',
    posterUrl: '',
    releaseYear: '',
    rating: ''
  });

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'USER'
  });

  // Check if user is admin
  useEffect(() => {
    console.log('User in AdminDashboard:', user);
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      console.log('User is not admin, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    
    console.log('User is admin, loading admin dashboard');
  }, [user, navigate]);

  // Fetch movies and users
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchMovies();
      fetchUsers();
    }
  }, [user]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Movie handlers
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedItem) {
        await axios.put(`http://localhost:8080/api/movies/${selectedItem.movieId}`, movieForm);
      } else {
        await axios.post('http://localhost:8080/api/movies', movieForm);
      }
      fetchMovies();
      closeMovieModal();
    } catch (error) {
      console.error('Error saving movie:', error);
      alert('Failed to save movie');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMovie = (movie) => {
    setSelectedItem(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      posterUrl: movie.posterUrl || movie.poster_url,
      releaseYear: movie.releaseYear || movie.release_year,
      rating: movie.rating
    });
    setShowMovieModal(true);
  };

  const handleDeleteMovie = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/movies/${selectedItem.movieId}`);
      fetchMovies();
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    }
  };

  // User handlers
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedItem) {
        await axios.put(`http://localhost:8080/api/admin/users/${selectedItem.userId}`, userForm);
      } else {
        await axios.post('http://localhost:8080/api/auth/register', userForm);
      }
      fetchUsers();
      closeUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (userItem) => {
    setSelectedItem(userItem);
    setUserForm({
      username: userItem.username,
      email: userItem.email,
      password: '',
      firstname: userItem.firstname,
      lastname: userItem.lastname,
      role: userItem.role
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${selectedItem.userId}`);
      fetchUsers();
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const openDeleteModal = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const closeMovieModal = () => {
    setShowMovieModal(false);
    setSelectedItem(null);
    setMovieForm({
      title: '',
      description: '',
      genre: '',
      posterUrl: '',
      releaseYear: '',
      rating: ''
    });
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedItem(null);
    setUserForm({
      username: '',
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      role: 'USER'
    });
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #DC2626 0%, #991B1B 100%)'
        }}
      >
        <div className="text-white text-2xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #DC2626 0%, #991B1B 100%)'
      }}
    >
      {/* Header - RED THEME FOR ADMIN */}
      <header className="bg-gray-900 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
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
                <span className="text-2xl mr-2">🎬</span>
                <h1 className="text-2xl font-bold text-white">StreamStack</h1>
              </div>
              <span className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                ⚡ ADMIN PANEL
              </span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg hover:bg-yellow-600 transition-colors shadow-lg ring-2 ring-yellow-300"
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border-2 border-yellow-500">
                  <div className="px-4 py-3 border-b-2 border-yellow-200 bg-yellow-50">
                    <p className="text-xs font-semibold text-yellow-800 uppercase">Admin Account</p>
                    <p className="font-bold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/dashboard');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    👤 User Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    ⚙️ Profile Settings
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 mb-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Admin {user?.username}! 👋
          </h1>
          <p className="text-gray-800 text-lg">
            You have full control over movies and users in the system
          </p>
          <div className="mt-4 flex gap-6 text-gray-900">
            <div className="bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-2xl font-bold">{movies.length}</p>
              <p className="text-sm">Total Movies</p>
            </div>
            <div className="bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm">Total Users</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              activeTab === 'movies'
                ? 'bg-yellow-500 text-gray-900 scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            🎬 Movies ({movies.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              activeTab === 'users'
                ? 'bg-yellow-500 text-gray-900 scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            👥 Users ({users.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-yellow-500">
          {/* Movies Tab */}
          {activeTab === 'movies' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Movies Management</h2>
                <button
                  onClick={() => setShowMovieModal(true)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  ➕ Add New Movie
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-4 py-3 font-bold text-left">Poster</th>
                      <th className="px-4 py-3 font-bold text-left">Title</th>
                      <th className="px-4 py-3 font-bold text-left">Genre</th>
                      <th className="px-4 py-3 font-bold text-left">Year</th>
                      <th className="px-4 py-3 font-bold text-left">Rating</th>
                      <th className="px-4 py-3 font-bold text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie, index) => (
                      <tr key={movie.movieId} className={`border-b hover:bg-yellow-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="px-4 py-3">
                          <img
                            src={movie.posterUrl || movie.poster_url}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded shadow"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48x64/DC2626/FFFFFF?text=M';
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{movie.title}</td>
                        <td className="px-4 py-3 text-gray-700">{movie.genre}</td>
                        <td className="px-4 py-3 text-gray-700">{movie.releaseYear || movie.release_year}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold">
                            ⭐ {movie.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditMovie(movie)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(movie, 'movie')}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  ➕ Add New User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-4 py-3 font-bold text-left">Username</th>
                      <th className="px-4 py-3 font-bold text-left">Full Name</th>
                      <th className="px-4 py-3 font-bold text-left">Email</th>
                      <th className="px-4 py-3 font-bold text-left">Role</th>
                      <th className="px-4 py-3 font-bold text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem, index) => (
                      <tr key={userItem.userId} className={`border-b hover:bg-yellow-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              userItem.role === 'ADMIN' ? 'bg-yellow-500 text-gray-900' : 'bg-blue-600'
                            }`}>
                              {userItem.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{userItem.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{userItem.firstname} {userItem.lastname}</td>
                        <td className="px-4 py-3 text-gray-700">{userItem.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            userItem.role === 'ADMIN' 
                              ? 'bg-yellow-200 text-yellow-900' 
                              : 'bg-blue-200 text-blue-900'
                          }`}>
                            {userItem.role === 'ADMIN' ? '⚡ ADMIN' : '👤 USER'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(userItem)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(userItem, 'user')}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
                              disabled={userItem.userId === user?.userId}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Movie Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-yellow-500">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedItem ? '✏️ Edit Movie' : '➕ Add New Movie'}
            </h3>
            
            <form onSubmit={handleMovieSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Genre *
                  </label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Release Year *
                  </label>
                  <input
                    type="number"
                    value={movieForm.releaseYear}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseYear: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Rating (0-10) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Poster URL *
                </label>
                <input
                  type="url"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-400 shadow-lg"
                >
                  {isLoading ? '⏳ Saving...' : selectedItem ? '✓ Update Movie' : '➕ Add Movie'}
                </button>
                <button
                  type="button"
                  onClick={closeMovieModal}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal - Same style as Movie Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-yellow-500">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedItem ? '✏️ Edit User' : '➕ Add New User'}
            </h3>
            
            <form onSubmit={handleUserSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={userForm.firstname}
                    onChange={(e) => setUserForm({ ...userForm, firstname: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={userForm.lastname}
                    onChange={(e) => setUserForm({ ...userForm, lastname: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Password {selectedItem && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required={!selectedItem}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Role *
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                >
                  <option value="USER">👤 USER</option>
                  <option value="ADMIN">⚡ ADMIN</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-400 shadow-lg"
                >
                  {isLoading ? '⏳ Saving...' : selectedItem ? '✓ Update User' : '➕ Add User'}
                </button>
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-red-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete {deleteType === 'movie' ? 'Movie' : 'User'}?
              </h3>
              <p className="text-gray-700 text-lg">
                Are you sure you want to delete <strong className="text-red-600">{selectedItem?.title || selectedItem?.username}</strong>?
              </p>
              <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition-colors"
              >
                ✕ Cancel
              </button>
              <button
                onClick={deleteType === 'movie' ? handleDeleteMovie : handleDeleteUser}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;