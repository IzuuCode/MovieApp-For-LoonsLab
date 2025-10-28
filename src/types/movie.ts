/**
 * Type Definitions for Movie-related data structures
 * These interfaces match the TMDb API response format
 */

/**
 * Basic Movie object returned from most API endpoints
 * Used for displaying movie cards in lists and grids
 */
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;      // Path to poster image (can be null)
  backdrop_path: string | null;    // Path to backdrop image (can be null)
  overview: string;                 // Movie description/synopsis
  release_date: string;             // Format: YYYY-MM-DD
  vote_average: number;             // Rating out of 10
  genre_ids: number[];              // Array of genre IDs (not full genre objects)
}

/**
 * Genre object with ID and human-readable name
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Video object for trailers and clips
 */
export interface Video {
  id: string;
  key: string;          // YouTube video ID
  name: string;         // Video title
  site: string;         // Platform (usually "YouTube")
  type: string;         // Type: "Trailer", "Teaser", "Clip", etc.
}

/**
 * Extended Movie Details with additional information
 * Extends the base Movie interface with full details
 * Used on the Movie Details page
 */
export interface MovieDetails extends Movie {
  genres: Genre[];              // Full genre objects (not just IDs)
  runtime: number;              // Duration in minutes
  status: string;               // "Released", "In Production", etc.
  tagline: string;              // Movie tagline/slogan
  budget: number;               // Production budget in USD
  revenue: number;              // Box office revenue in USD
  videos?: {                    // Optional video data
    results: Video[];
  };
}

/**
 * Cast member information
 */
export interface CastMember {
  id: number;
  name: string;                 // Actor's name
  character: string;            // Character name they played
  profile_path: string | null;  // Path to actor's photo
}

/**
 * Crew member information
 */
export interface CrewMember {
  id: number;
  name: string;                 // Crew member's name
  job: string;                  // Job title (e.g., "Director")
  department: string;           // Department (e.g., "Directing")
  profile_path: string | null;  // Path to crew member's photo
}

/**
 * Movie Credits containing both cast and crew
 */
export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

/**
 * Paginated search results structure
 * Returned by search and discovery endpoints
 */
export interface SearchResults {
  page: number;              // Current page number
  results: Movie[];          // Array of movies for this page
  total_pages: number;       // Total number of pages available
  total_results: number;     // Total number of results across all pages
}