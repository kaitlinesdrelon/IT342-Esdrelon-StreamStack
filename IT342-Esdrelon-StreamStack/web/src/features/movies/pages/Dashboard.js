import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/context/AuthContext';
import { moviesData } from '../components/Movies'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, subscribe } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // LOGIC FIX: Separate the source data from the filtered display data
  const [allMovies, setAllMovies] = useState([]); 
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState(['All']);

  // INITIAL LOAD: Runs only once
  useEffect(() => {
    if (moviesData) {
      setAllMovies(moviesData);
      setFilteredMovies(moviesData);

      const uniqueGenres = ['All', ...new Set(moviesData.map(movie => movie.genre))];
      setCategories(uniqueGenres);
    }

    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const savedWatched = JSON.parse(localStorage.getItem('watched') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    setWatchlist(savedWatchlist);
    setWatched(savedWatched);
    setFavorites(savedFavorites);
  }, []);

  // FILTER LOGIC: Fixes the Infinite Loop
  useEffect(() => {
    // Use allMovies as the static source for filtering
    let filtered = allMovies;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(movie => movie.genre === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
    // CRITICAL: We depend on allMovies, not filteredMovies, to prevent the loop
  }, [selectedCategory, searchQuery, allMovies]);

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

      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative"> 
            
            <div className="flex items-center w-10"></div> 

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <img 
                src="/Logo_long.png" 
                alt="StreamStack" 
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate('/dashboard')}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">✕</button>
            )}
          </div>
        </div>

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
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{movie.title}</h3>
                  <p className="text-xs text-gray-500">{movie.genre} • {movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white">
            <h3 className="text-2xl font-bold">No Movies Found</h3>
          </div>
        )}
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Are you sure you want to logout?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleLogoutConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-lg">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;