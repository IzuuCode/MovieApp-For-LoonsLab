import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getImageUrl } from '../services/movieService';
import { useMovies } from '../context/MovieContext';
import { 
  Heart, ChevronLeft, Star, Clock, Calendar, 
  Film, Users, Youtube, Info, Loader 
} from 'lucide-react';
import { MovieDetails, MovieCredits, CastMember, Video } from '../types/movie';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch movie details and credits in parallel
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id)
        ]);
        
        setMovie(movieData);
        setCredits(creditsData);
        
        // Find trailer in videos
        if (movieData.videos && movieData.videos.results) {
          const officialTrailer = movieData.videos.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          );
          setTrailer(officialTrailer || null);
        }
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFavoriteClick = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format release date
  const formatReleaseDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Movie not found.'}</p>
          <button 
            onClick={handleBackClick}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const director = credits?.crew.find(person => person.job === 'Director');

  return (
    <div className="pt-16 min-h-screen">
      {/* Movie Backdrop */}
      <div 
        className="relative w-full h-[50vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <button 
              onClick={handleBackClick}
              className="mb-4 inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white hover:bg-white/30 transition"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Movie Content */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src={getImageUrl(movie.poster_path, 'w500')} 
                alt={`${movie.title} poster`}
                className="w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleFavoriteClick}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  favorite
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700'
                }`}
              >
                <Heart className="h-5 w-5" fill={favorite ? "currentColor" : "none"} />
                <span>{favorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
              
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 italic">
                  "{movie.tagline}"
                </p>
              )}
              
              {/* Movie Meta */}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" />
                  <span className="text-yellow-800 dark:text-yellow-300 font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-300 font-medium">
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-300 font-medium">
                    {formatReleaseDate(movie.release_date)}
                  </span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Overview */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Overview
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {director && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Director
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {director.name}
                    </p>
                  </div>
                )}
                
                {movie.status && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Status
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {movie.status}
                    </p>
                  </div>
                )}
                
                {movie.budget > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Budget
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      ${movie.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Revenue
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      ${movie.revenue.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Cast */}
              {credits && credits.cast.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Cast
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {credits.cast.slice(0, 10).map((person: CastMember) => (
                      <div key={person.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                        <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-600">
                          {person.profile_path ? (
                            <img
                              src={getImageUrl(person.profile_path, 'w185')}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {person.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {person.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-5xl">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {trailer.name}
              </h3>
              <button 
                onClick={() => setShowTrailer(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                title={`${movie.title} Trailer`}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;