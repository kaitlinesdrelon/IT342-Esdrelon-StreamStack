import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    // Simulate fetching movie details
    setTimeout(() => {
      setMovie({
        id: id,
        title: 'Sample Movie',
        year: 2024,
        rating: 8.5,
        genre: 'Action',
        duration: '2h 15m',
        description: 'This is a detailed description of the movie. It provides comprehensive information about the plot, characters, and storyline. This movie is an epic adventure that takes viewers on an unforgettable journey.',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Marion Cotillard'],
        posterUrl: 'https://via.placeholder.com/300x450/2563EB/FFFFFF?text=Movie+Poster',
        trailerUrl: '#',
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleAddToWatchlist = () => {
    setInWatchlist(!inWatchlist);
  };

  const handleMarkAsWatched = () => {
    setIsWatched(!isWatched);
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)'
        }}
      >
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)'
        }}
      >
        <div className="text-white text-2xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)'
      }}
    >
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Movies
          </button>
        </div>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-600">{movie.year}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{movie.duration}</span>
                <span className="text-gray-400">•</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {movie.genre}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-3xl font-bold text-gray-800">{movie.rating}</span>
                <span className="text-gray-500">/10</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Overview</h2>
                <p className="text-gray-600 leading-relaxed">{movie.description}</p>
              </div>

              {/* Director & Cast */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Director</h3>
                <p className="text-gray-600">{movie.director}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Cast</h3>
                <p className="text-gray-600">{movie.cast.join(', ')}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToWatchlist}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    inWatchlist
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                </button>
                <button
                  onClick={handleMarkAsWatched}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isWatched
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isWatched ? '✓ Watched' : 'Mark as Watched'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;