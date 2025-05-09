import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import MovieGrid from '../components/MovieGrid';
import { Heart, Search, X, Filter } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { favorites } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'title' | 'date' | 'rating'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the filtered favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortOption === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortOption === 'date') {
      const dateA = new Date(a.release_date || '').getTime();
      const dateB = new Date(b.release_date || '').getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else { // rating
      return sortDirection === 'asc' 
        ? a.vote_average - b.vote_average
        : b.vote_average - a.vote_average;
    }
  });

  const handleSortChange = (option: 'title' | 'date' | 'rating') => {
    if (option === sortOption) {
      // Toggle direction if same option is selected
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New option, set default to ascending for title, descending for others
      setSortOption(option);
      setSortDirection(option === 'title' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="pt-24 min-h-screen pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Heart className="h-8 w-8 text-red-600 mr-3" fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Favorites
          </h1>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search your favorites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleSortChange('title')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        sortOption === 'title'
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Title {sortOption === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => handleSortChange('date')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        sortOption === 'date'
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Date {sortOption === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => handleSortChange('rating')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        sortOption === 'rating'
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Rating {sortOption === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {sortedFavorites.length > 0 ? (
              <MovieGrid movies={sortedFavorites} />
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Search className="h-16 w-16 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  No favorites match your search for "{searchTerm}".
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Heart className="h-16 w-16 mx-auto text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Your favorites list is empty
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Start exploring movies and add them to your favorites!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Explore Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;