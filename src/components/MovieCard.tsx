import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { Star, Heart, Calendar } from 'lucide-react';
import { getImageUrl } from '../services/movieService';
import { useMovies } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Format release date
  const formattedDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown Release Date';

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="movie-card relative rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 h-full">
        <div className="relative aspect-[2/3]">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
            }}
          />
          <div className="movie-card-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-yellow-500 bg-opacity-90 text-black font-bold px-2 py-1 rounded text-xs">
                <Star className="h-3 w-3" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <button
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-full transition-colors ${
                  favorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-800 bg-opacity-70 text-white hover:bg-red-500'
                }`}
              >
                <Heart className="h-4 w-4" fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;