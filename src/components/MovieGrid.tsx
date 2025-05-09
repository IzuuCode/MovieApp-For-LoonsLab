import React, { useRef, useCallback } from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { useMovies } from '../context/MovieContext';
import { Loader } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  enableInfiniteScroll?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  title, 
  enableInfiniteScroll = false 
}) => {
  const { loading, loadMoreResults, searchResults } = useMovies();
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Reference to the last movie element for infinite scrolling
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && enableInfiniteScroll) {
        loadMoreResults();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, enableInfiniteScroll, loadMoreResults]);

  const hasMorePages = searchResults?.page && searchResults?.total_pages 
    ? searchResults.page < searchResults.total_pages 
    : false;

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 my-8">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => {
          // Check if this is the last element and we're using infinite scroll
          const isLastElement = index === movies.length - 1 && enableInfiniteScroll && hasMorePages;
          
          return (
            <div 
              key={`${movie.id}-${index}`} 
              ref={isLastElement ? lastMovieElementRef : null}
              className="slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Loader className="h-6 w-6 animate-spin" />
            <span>Loading more movies...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;