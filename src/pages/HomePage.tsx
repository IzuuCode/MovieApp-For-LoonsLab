import React, { useEffect, useState } from 'react';
import { useMovies } from '../context/MovieContext';
import MovieGrid from '../components/MovieGrid';
import { fetchGenres } from '../services/movieService';
import { Film, Search, TrendingUp } from 'lucide-react';
import { Genre } from '../types/movie';

const HomePage: React.FC = () => {
  const { trending, searchResults, loading, error, lastSearch, searchMoviesAction } = useMovies();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };

    loadGenres();

    // If there was a last search, execute it again
    if (lastSearch) {
      searchMoviesAction(lastSearch);
    }
  }, [lastSearch, searchMoviesAction]);

  // Filter trending movies by selected genre
  const filteredTrending = selectedGenre
    ? trending.filter(movie => movie.genre_ids.includes(selectedGenre))
    : trending;

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white py-16 lg:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Movies</h1>
            <p className="text-xl mb-8 text-indigo-200">
              Your gateway to the world of cinema. Search, explore, and find your next favorite movie.
            </p>
            <div className="flex justify-center">
              <a 
                href="#trending" 
                className="bg-white text-indigo-900 font-medium px-6 py-3 rounded-full shadow-lg hover:bg-indigo-100 transition-colors flex items-center"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Trending Movies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md mb-6 mx-4 mt-6">
          <p>{error}</p>
        </div>
      )}

      {/* Search Results Section */}
      {searchResults && (
        <div className="mt-12">
          <div className="container mx-auto px-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Search className="h-6 w-6" />
              <h2 className="text-2xl md:text-3xl font-bold">
                Search Results for "{lastSearch}"
              </h2>
              <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 py-1 px-3 rounded-full text-sm">
                {searchResults.total_results} movies found
              </span>
            </div>
          </div>
          <MovieGrid 
            movies={searchResults.results} 
            enableInfiniteScroll={true} 
          />
        </div>
      )}

      {/* Trending Movies Section */}
      <div id="trending" className="mt-12">
        <div className="container mx-auto px-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <TrendingUp className="h-6 w-6" />
              <h2 className="text-2xl md:text-3xl font-bold">Trending This Week</h2>
            </div>
            
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`text-sm px-3 py-1 rounded-full transition ${
                  selectedGenre === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              
              {genres.slice(0, 7).map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id === selectedGenre ? null : genre.id)}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    selectedGenre === genre.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {filteredTrending.length > 0 ? (
          <MovieGrid movies={filteredTrending} />
        ) : (
          <div className="text-center py-12">
            <Film className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {selectedGenre 
                ? 'No trending movies found for this genre.' 
                : 'No trending movies available right now.'}
            </p>
            {selectedGenre && (
              <button
                onClick={() => setSelectedGenre(null)}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all trending movies
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;