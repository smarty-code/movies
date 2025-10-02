import { Client, Databases, ID, Query } from "react-native-appwrite";
import { fetchWithCache, CACHE_KEYS, CACHE_DURATION, removeCachedData, clearCacheByPrefix } from './cacheService';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

/**
 * Updates the view count for a movie when a user visits the movie details page
 * This tracks popularity based on how many times users view each movie
 * Also invalidates the trending movies cache
 */
export const updateMovieViewCount = async (movie: Movie) => {
  try {
    // Check if this movie already exists in the database
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", movie.id),
    ]);

    if (result.documents.length > 0) {
      // Movie exists - increment the view count
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
      console.log(`✅ Updated view count for: ${movie.title} (${existingMovie.count + 1} views)`);
    } else {
      // Movie doesn't exist - create new entry
      // Handle both WatchMode (full URL) and TMDB (path) formats
      const posterUrl = movie.poster_path?.startsWith('http')
        ? movie.poster_path // WatchMode: already a full URL
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // TMDB: construct URL
      
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: posterUrl,
      });
      console.log(`✅ Created new entry for: ${movie.title} (1 view)`);
    }
    
    // Invalidate trending movies cache since view counts changed
    await removeCachedData(CACHE_KEYS.TRENDING);
  } catch (error) {
    console.error("❌ Error updating movie view count:", error);
    // Don't throw error to prevent blocking the UI
  }
};

/**
 * Legacy function for backward compatibility
 * Now redirects to updateMovieViewCount
 */
export const updateSearchCount = async (query: string, movie: Movie) => {
  // Just update the movie view count instead
  return updateMovieViewCount(movie);
};

/**
 * Gets the view count for a specific movie
 * Returns the count or 0 if the movie hasn't been viewed yet
 */
export const getMovieViewCount = async (movieId: number): Promise<number> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", movieId),
    ]);

    if (result.documents.length > 0) {
      return result.documents[0].count;
    }
    
    return 0;
  } catch (error) {
    console.error("❌ Error fetching movie view count:", error);
    return 0;
  }
};

/**
 * Gets the most popular movies based on view count
 * Returns top 5 movies ordered by view count (descending)
 * Uses caching to reduce database calls
 */
export const getTrendingMovies = async (
  forceRefresh: boolean = false
): Promise<TrendingMovie[] | undefined> => {
  const fetchTrending = async (): Promise<TrendingMovie[] | undefined> => {
    try {
      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(5),
        Query.orderDesc("count"),
      ]);

      console.log(`📊 Fetched ${result.documents.length} trending movies from database`);
      
      return result.documents as unknown as TrendingMovie[];
    } catch (error) {
      console.error("❌ Error fetching trending movies:", error);
      return undefined;
    }
  };

  return fetchWithCache(
    CACHE_KEYS.TRENDING,
    fetchTrending,
    CACHE_DURATION.TRENDING,
    forceRefresh
  );
};

// ============================================
// SAVED MOVIES / WATCHLIST FUNCTIONS
// ============================================

/**
 * Save a movie to the watchlist
 * @param movie - Movie data to save
 */
export const saveMovie = async (movie: Movie | MovieDetails): Promise<void> => {
  try {
    // Check if movie already saved
    const existing = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", movie.id),
    ]);

    if (existing.documents.length > 0) {
      console.log(`ℹ️ Movie "${movie.title}" is already saved`);
      return;
    }

    // Handle both WatchMode (full URL) and TMDB (path) formats
    const posterUrl = movie.poster_path?.startsWith('http')
      ? movie.poster_path
      : movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '';

    // Create new saved movie entry
    await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
      movie_id: movie.id,
      title: movie.title,
      poster_url: posterUrl,
      saved_at: new Date().toISOString(),
      vote_average: movie.vote_average || 0,
      release_date: movie.release_date || '',
    });

    console.log(`✅ Saved movie: ${movie.title}`);

    // Invalidate saved movies cache
    await clearCacheByPrefix('saved_');
  } catch (error) {
    console.error("❌ Error saving movie:", error);
    throw error;
  }
};

/**
 * Remove a movie from the watchlist
 * @param movieId - Movie ID to remove
 */
export const unsaveMovie = async (movieId: number): Promise<void> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", movieId),
    ]);

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        result.documents[0].$id
      );
      console.log(`🗑️ Removed movie ID ${movieId} from watchlist`);

      // Invalidate saved movies cache
      await clearCacheByPrefix('saved_');
    }
  } catch (error) {
    console.error("❌ Error removing movie:", error);
    throw error;
  }
};

/**
 * Check if a movie is saved in the watchlist
 * @param movieId - Movie ID to check
 * @returns true if saved, false otherwise
 */
export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", movieId),
    ]);

    return result.documents.length > 0;
  } catch (error) {
    console.error("❌ Error checking if movie is saved:", error);
    return false;
  }
};

/**
 * Get all saved movies from the watchlist
 * Uses caching to reduce database calls
 * @param forceRefresh - Skip cache and fetch fresh data
 * @returns Array of saved movies
 */
export const getSavedMovies = async (
  forceRefresh: boolean = false
): Promise<SavedMovie[]> => {
  const fetchSaved = async (): Promise<SavedMovie[]> => {
    try {
      const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
        Query.orderDesc("saved_at"),
        Query.limit(100),
      ]);

      console.log(`💾 Fetched ${result.documents.length} saved movies from database`);
      
      return result.documents as unknown as SavedMovie[];
    } catch (error) {
      console.error("❌ Error fetching saved movies:", error);
      return [];
    }
  };

  return fetchWithCache(
    'saved_movies_list',
    fetchSaved,
    1000 * 60 * 5, // 5 minutes cache
    forceRefresh
  );
};

/**
 * Get the count of saved movies
 * @returns Number of saved movies
 */
export const getSavedMoviesCount = async (): Promise<number> => {
  try {
    const movies = await getSavedMovies();
    return movies.length;
  } catch (error) {
    console.error("❌ Error getting saved movies count:", error);
    return 0;
  }
};