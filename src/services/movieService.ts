import axios from 'axios';
import { MovieDetails, SearchResults, MovieCredits } from '../types/movie';

// TMDb API Configuration
// API documentation: https://developers.themoviedb.org/3
const API_KEY = '0b17b4a54580b457d01251a7755a1e74'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with pre-configured base URL and default parameters
// This ensures all API requests include the API key and language automatically
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

/**
 * Converts a TMDb image path to a full URL
 * @param path - The image path from TMDb API (e.g., "/abc123.jpg")
 * @param size - Image size (w500, w185, original, etc.). Default: w500
 * @returns Full image URL or placeholder if path is null
 */
export const getImageUrl = (path: string | null, size = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image+Available';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};


/**
 * Fetches trending movies for the current week
 * @returns Promise with paginated movie results
 * @throws Error if API request fails
 */
export const fetchTrendingMovies = async (): Promise<SearchResults> => {
  try {
    const response = await api.get('/trending/movie/week');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw new Error('Failed to fetch trending movies');
  }
};

/**
 * Searches for movies by query string
 * @param query - Search query string
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with paginated search results
 * @throws Error if search fails
 */
export const searchMovies = async (query: string, page = 1): Promise<SearchResults> => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false  // Filter out adult content
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
};


/**
 * Fetches detailed information for a specific movie
 * @param movieId - The TMDb movie ID
 * @returns Promise with complete movie details including videos/trailers
 * @throws Error if request fails
 */
export const getMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos'  // Include trailers and video content
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};


/**
 * Fetches cast and crew information for a movie
 * @param movieId - The TMDb movie ID
 * @returns Promise with cast and crew data
 * @throws Error if request fails
 */
export const getMovieCredits = async (movieId: string): Promise<MovieCredits> => {
  try {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw new Error('Failed to fetch movie credits');
  }
};


export const fetchMoviesByGenre = async (genreId: number, page = 1): Promise<SearchResults> => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    throw new Error('Failed to fetch movies by genre');
  }
};


export const fetchGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres');
  }
};