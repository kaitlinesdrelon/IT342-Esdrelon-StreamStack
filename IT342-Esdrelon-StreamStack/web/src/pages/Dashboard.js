import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moviesData } from '../data/Movies';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, subscribe } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    // Load movies from shared data
    setMovies(moviesData);
    setFilteredMovies(moviesData);

    // Extract unique genres from movies
    const uniqueGenres = ['All', ...new Set(moviesData.map(movie => movie.genre))];
    setCategories(uniqueGenres);

    // Load watchlist, watched, favorites from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const savedWatched = JSON.parse(localStorage.getItem('watched') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    setWatchlist(savedWatchlist);
    setWatched(savedWatched);
    setFavorites(savedFavorites);
  }, []);

  // Filter movies based on category and search
  useEffect(() => {
    let filtered = movies;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(movie => movie.genre === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [selectedCategory, searchQuery, movies]);

  useEffect(() => {
    const observer = {
      onAuthChange: (action, data) => {
        if (action === 'LOGOUT') {
          navigate('/login');
        }
      }
    };
    
    const unsubscribe = subscribe(observer);
    return () => unsubscribe();
  }, [subscribe, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
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
            <div className="flex items-center">
              <span className="text-2xl mr-2">🎬</span>
              <h1 className="text-2xl font-bold text-white">StreamStack</h1>
            </div>
            
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
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                   {/* ADMIN BUTTON - ONLY FOR KAI.ESDRELON */}
              {user?.role === 'ADMIN' && user?.email === 'kaitlin@gmail.com' && (
                <>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/admin');
                    }}
                    className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-50 font-bold"
                  >
                    ⚡Admin Dashboard
                  </button>
                </>
              )}
        
              <div className="px-4 py-2 border-t border-b">
                <p className="text-xs text-gray-500">My Lists</p>
                <p className="text-sm text-gray-700">Watchlist: {watchlist.length}</p>
                <p className="text-sm text-gray-700">Watched: {watched.length}</p>
                <p className="text-sm text-gray-700">Favorites: {favorites.length}</p>
              </div>
              <hr className="my-2" />
              <button
                onClick={handleLogoutClick}
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



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Hero Banner */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user.username}!
          </h2>
          <p className="text-blue-100">Discover thousands of movies</p>
          <div className="mt-4 flex gap-4 text-white">
            <div>
              <p className="text-2xl font-bold">{watchlist.length}</p>
              <p className="text-sm text-blue-100">Watchlist</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{watched.length}</p>
              <p className="text-sm text-blue-100">Watched</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-sm text-blue-100">Favorites</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
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

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
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

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer transform hover:scale-105 duration-200"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/2563EB/FFFFFF?text=' + movie.title.substring(0, 1);
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ {movie.rating}
                  </div>
                  {watchlist.includes(movie.id) && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                      📋 Watchlist
                    </div>
                  )}
                  {watched.includes(movie.id) && (
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                      ✓ Watched
                    </div>
                  )}
                  {favorites.includes(movie.id) && (
                    <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                      ❤️
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{movie.title}</h3>
                  <p className="text-xs text-gray-500">{movie.genre} • {movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Movies Found</h3>
            <p className="text-blue-200 mb-4">
              {searchQuery
                ? `No movies found for "${searchQuery}"`
                : `No ${selectedCategory} movies available`
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Logout</h3>
              <p className="text-gray-600">
                Are you sure you want to logout?
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;