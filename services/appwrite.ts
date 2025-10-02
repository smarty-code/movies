import { Client, Databases, ID, Query } from "react-native-appwrite";
import { fetchWithCache, CACHE_KEYS, CACHE_DURATION, removeCachedData } from './cacheService';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

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