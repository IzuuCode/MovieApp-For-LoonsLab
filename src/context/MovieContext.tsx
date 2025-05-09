import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, SearchResults } from '../types/movie';
import { fetchTrendingMovies, searchMovies } from '../services/movieService';

interface MovieContextType {
  trending: Movie[];
  searchResults: SearchResults | null;
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  lastSearch: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMoviesAction: (query: string, page?: number) => Promise<void>;
  loadMoreResults: () => Promise<void>;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }

    const savedLastSearch = localStorage.getItem('lastSearch');
    if (savedLastSearch) {
      setLastSearch(savedLastSearch);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch trending movies on initial render
  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingMovies();
        setTrending(data.results);
      } catch (err) {
        setError('Failed to fetch trending movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  const searchMoviesAction = async (query: string, page = 1) => {
    try {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }

      setLoading(true);
      setError(null);
      
      const data = await searchMovies(query, page);
      setSearchResults(data);
      setLastSearch(query);
      localStorage.setItem('lastSearch', query);
    } catch (err) {
      setError('Failed to search movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (!searchResults || loading || !searchResults.page || !searchResults.total_pages || searchResults.page >= searchResults.total_pages) {
      return;
    }

    try {
      setLoading(true);
      const nextPage = searchResults.page + 1;
      const newData = await searchMovies(lastSearch, nextPage);
      
      setSearchResults({
        ...newData,
        results: [...searchResults.results, ...newData.results]
      });
    } catch (err) {
      setError('Failed to load more results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (movie: Movie) => {
    setFavorites(prev => {
      // Check if the movie is already in favorites
      if (prev.some(m => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  return (
    <MovieContext.Provider 
      value={{ 
        trending, 
        searchResults, 
        favorites, 
        loading, 
        error,
        lastSearch,
        searchQuery,
        setSearchQuery,
        searchMoviesAction, 
        loadMoreResults,
        addToFavorites, 
        removeFromFavorites, 
        isFavorite 
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};