import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // All movies data
  const allMovies = [
    {
      id: 1,
      title: 'Michael',
      year: 2026,
      rating: 7.7,
      genre: 'Drama, History, Music',
      duration: '2h 7m',
      description: 'The early life of the famous musician Michael Jackson, known as the King of Pop.',
      director: 'Antoine Fuqua',
      cast: 'Jaafar Jackson, Nia Long, Colman Domingo',
      image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQL2cOUD1HjXl3pCCXGiSC5jgGa2Iwlrty_DnkqCHlY9KcM9niZ'
    },
    {
      id: 2,
      title: 'Apex',
      year: 2026,
      rating: 6.2,
      genre: 'Survival, Action, Thriller',
      duration: '1h 35m',
      description: 'A mountain climber haunted by a fatal decision in Norway retreats to the Australian wilderness for isolation. Her journey turns into a desperate hunt when a deceptive local targets her as his next ritualistic prey in the bush.',
      director: 'Baltasar Kormákur',
      cast: 'Charlize Theron, Taron Egerton, Eric Bana',
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT8gHLJss2Y7cuezGRtJE-us89hAvE7gX5_yXlP3_nzxATtPLFb'
    },
    {
      id: 3,
      title: 'The Dark Knight',
      year: 2008,
      rating: 9.0,
      genre: 'Action',
      duration: '2h 32m',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. A gripping tale of heroism, sacrifice, and the thin line between order and chaos.',
      director: 'Christopher Nolan',
      cast: 'Christian Bale, Heath Ledger, Aaron Eckhart',
      image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR2Cghv6inVgiEL-vAYFJg8Rff175LiNaWKzV4tytSLG6D0c2n_'
    },
    {
      id: 4,
      title: 'Project Hail Mary',
      year: 2026,
      rating: 8.3,
      genre: 'Sci-Fi',
      duration: '2h 36m',
      description: 'A science teacher wakes up alone on a spaceship. As his memory returns, he uncovers a mission to stop a mysterious substance killing Earths sun and that an unexpected friendship may be the key.',
      director: 'Phil Lord, Christopher Miller',
      cast: 'Ryan Gosling, Sandra Hüller, James Ortiz',
      image: 'https://m.media-amazon.com/images/M/MV5BNTkwNzJiYTctNzI3NC00NjE1LTlhYjktY2Q5MTdmMWFmNzcxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      id: 5,
      title: 'Pulp Fiction',
      year: 1994,
      rating: 8.9,
      genre: 'Crime',
      duration: '2h 34m',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. Quentin Tarantino\'s masterpiece weaves together multiple storylines in a non-linear narrative.',
      director: 'Quentin Tarantino',
      cast: 'John Travolta, Uma Thurman, Samuel L. Jackson',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbSNEhMVl8ANfQyUahlMV0kaZ5RqGI98Lbj_ZIlNS7hawiJqw5tqWPHGbYpPE9E6MLTh33wA&s=10'
    },
    {
      id: 6,
      title: 'The Matrix',
      year: 1999,
      rating: 8.7,
      genre: 'Sci-Fi',
      duration: '2h 16m',
      description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. This groundbreaking film revolutionized action cinema with its innovative visual effects.',
      director: 'Lana Wachowski, Lilly Wachowski',
      cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
      image: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_.jpg'
    },
    {
      id: 7,
      title: 'Forrest Gump',
      year: 1994,
      rating: 8.8,
      genre: 'Drama',
      duration: '2h 22m',
      description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75. A heartwarming tale of life, love, and destiny.',
      director: 'Robert Zemeckis',
      cast: 'Tom Hanks, Robin Wright, Gary Sinise',
      image: 'https://cdn.kinocheck.com/i/ogicothwme.jpg'
    },
    {
      id: 8,
      title: 'Fight Club',
      year: 1999,
      rating: 8.8,
      genre: 'Thriller',
      duration: '2h 19m',
      description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much more. A dark and twisted commentary on modern masculinity and consumer culture.',
      director: 'David Fincher',
      cast: 'Brad Pitt, Edward Norton, Helena Bonham Carter',
      image: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg'
    },
      {
      id: 9,
      title: 'The Devil Wears Prada 2',
      year: 2026,
      rating: 7.0,
      genre: 'Comedy',
      duration: '1h 59m',
      description: 'Miranda Priestly navigates her career amid the decline of traditional magazine publishing and reunites with Andy Sachs to face off against a former assistant turned rival.',
      director: 'David Frankel',
      cast: 'Meryl Streep, Anne Hathaway, Emily Blunt',
      image: 'https://m.media-amazon.com/images/M/MV5BZmM3ZDU3ODItZmY5Yi00OTQ2LWE5OTctZTA5NDBhMWJkOGY3XkEyXkFqcGc@._V1_.jpg'
    },
      {
      id: 10,
      title: 'The Super Mario Galaxy Movie',
      year: 2026,
      rating: 6.4,
      genre: 'Adventure',
      duration: '1h 38m',
      description: 'Mario ventures into space, exploring cosmic worlds and tackling galactic challenges far from the familiar Mushroom Kingdom.',
      director: 'Aaron Horvath, Michael Jelenic, Pierre Leduc',
      cast: 'Brie Larson, Virginia Dare Jelenic, Benny Safdie',
      image: 'https://upload.wikimedia.org/wikipedia/en/b/bf/The_Super_Mario_Galaxy_Movie_poster.jpeg'
    },
    {
      id: 11,
      title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
      year: 2005,
      rating: 6.9,
      genre: 'Adventure',
      duration: '2h 23m',
      description: 'Four siblings wind up entering the magical land of Narnia. Once there, they discover a world inhabited by fantastical creatures and find themselves in a battle to defeat a witch.',
      director: 'Andrew Adamson',
      cast: 'Tilda Swinton, Georgie Henley, William Moseley, Skandar Keynes',
      image: 'https://m.media-amazon.com/images/M/MV5BMTc0NTUwMTU5OV5BMl5BanBnXkFtZTcwNjAwNzQzMw@@._V1_.jpg'
    },
    {
      id: 12,
      title: 'Miss Peregrines Home for Peculiar Children',
      year: 2016,
      rating: 6.7,
      genre: 'Fantasy',
      duration: '2h 7m',
      description: 'When Jacob discovers clues to a mystery that stretches across time, he finds Miss Peregrines Home for Peculiar Children. But the danger deepens after he gets to know the residents and learns about their special powers.',
      director: 'Tim Burton',
      cast: 'Eva Green, Asa Butterfield, Samuel L. Jackson',
      image: 'https://m.media-amazon.com/images/M/MV5BMTU0Nzc5NzI5NV5BMl5BanBnXkFtZTgwNTk1MDE4MDI@._V1_FMjpg_UX1000_.jpg'
    }
  ];

  useEffect(() => {
    // Find movie by ID
    const foundMovie = allMovies.find(m => m.id === parseInt(id));
    
    if (foundMovie) {
      setMovie(foundMovie);
    }
    
    setIsLoading(false);

    // Load saved states from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const savedWatched = JSON.parse(localStorage.getItem('watched') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    setInWatchlist(savedWatchlist.includes(parseInt(id)));
    setIsWatched(savedWatched.includes(parseInt(id)));
    setIsFavorite(savedFavorites.includes(parseInt(id)));
  }, [id]);

  const handleAddToWatchlist = () => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const movieId = parseInt(id);
    
    if (inWatchlist) {
      // Remove from watchlist
      const updatedWatchlist = savedWatchlist.filter(item => item !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setInWatchlist(false);
    } else {
      // Add to watchlist
      const updatedWatchlist = [...savedWatchlist, movieId];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setInWatchlist(true);
    }
  };

  const handleMarkAsWatched = () => {
    const savedWatched = JSON.parse(localStorage.getItem('watched') || '[]');
    const movieId = parseInt(id);
    
    if (isWatched) {
      // Remove from watched
      const updatedWatched = savedWatched.filter(item => item !== movieId);
      localStorage.setItem('watched', JSON.stringify(updatedWatched));
      setIsWatched(false);
    } else {
      // Add to watched
      const updatedWatched = [...savedWatched, movieId];
      localStorage.setItem('watched', JSON.stringify(updatedWatched));
      setIsWatched(true);
    }
  };

  const handleAddToFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const movieId = parseInt(id);
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = savedFavorites.filter(item => item !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      const updatedFavorites = [...savedFavorites, movieId];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
    }
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
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <div className="text-white text-2xl mb-4">Movie not found</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
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
                src={movie.image}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/2563EB/FFFFFF?text=' + movie.title.substring(0, 1);
                }}
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

              {/* Overview */}
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
                <p className="text-gray-600">{movie.cast}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleAddToWatchlist}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    inWatchlist
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Watchlist
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleMarkAsWatched}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isWatched
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isWatched ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Watched
                    </>
                  ) : (
                    <>
                      Mark as Watched
                    </>
                  )}
                </button>

                <button
                  onClick={handleAddToFavorites}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isFavorite ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      Favorited
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Add to Favorites
                    </>
                  )}
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