/**
 * Cached API Service
 * Wraps all API calls with caching logic
 */

import {
  fetchWithCache,
  CACHE_KEYS,
  CACHE_DURATION,
} from './cacheService';
import { fetchMovies as fetchMoviesApi, fetchMovieDetails as fetchMovieDetailsApi } from './api';

/**
 * Fetch movies with caching
 * @param query - Search query (empty string for popular movies)
 * @param forceRefresh - Skip cache and fetch fresh data
 */
export const fetchMoviesCached = async (
  query: string,
  forceRefresh: boolean = false
): Promise<Movie[]> => {
  const cacheKey = query 
    ? `${CACHE_KEYS.SEARCH_RESULTS}${query.toLowerCase()}`
    : `${CACHE_KEYS.MOVIES}popular`;

  const cacheDuration = query ? CACHE_DURATION.SEARCH : CACHE_DURATION.MOVIES;

  return fetchWithCache(
    cacheKey,
    () => fetchMoviesApi({ query }),
    cacheDuration,
    forceRefresh
  );
};

/**
 * Fetch movie details with caching
 * @param movieId - Movie ID
 * @param forceRefresh - Skip cache and fetch fresh data
 */
export const fetchMovieDetailsCached = async (
  movieId: string,
  forceRefresh: boolean = false
): Promise<MovieDetails> => {
  const cacheKey = `${CACHE_KEYS.MOVIE_DETAILS}${movieId}`;

  return fetchWithCache(
    cacheKey,
    () => fetchMovieDetailsApi(movieId),
    CACHE_DURATION.MOVIE_DETAILS,
    forceRefresh
  );
};
