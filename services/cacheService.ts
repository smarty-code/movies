import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cache Service - Handles all caching operations using AsyncStorage
 * Provides a layer between API calls and local storage
 */

// Cache key prefixes for different data types
export const CACHE_KEYS = {
  MOVIES: 'movies_',
  MOVIE_DETAILS: 'movie_details_',
  TRENDING: 'trending_movies',
  SEARCH_RESULTS: 'search_results_',
};

// Cache expiration times (in milliseconds)
export const CACHE_DURATION = {
  MOVIES: 1000 * 60 * 30, // 30 minutes
  MOVIE_DETAILS: 1000 * 60 * 60, // 1 hour
  TRENDING: 1000 * 60 * 15, // 15 minutes
  SEARCH: 1000 * 60 * 10, // 10 minutes
};

interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Generic function to get cached data
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedItem = await AsyncStorage.getItem(key);
    
    if (!cachedItem) {
      console.log(`📦 Cache MISS for key: ${key}`);
      return null;
    }

    const parsedData: CachedData<T> = JSON.parse(cachedItem);
    const now = Date.now();

    // Check if cache has expired
    if (now > parsedData.expiresAt) {
      console.log(`⏰ Cache EXPIRED for key: ${key}`);
      await AsyncStorage.removeItem(key);
      return null;
    }

    console.log(`✅ Cache HIT for key: ${key}`);
    return parsedData.data;
  } catch (error) {
    console.error(`❌ Error reading cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Generic function to set cached data
 * @param key - Cache key
 * @param data - Data to cache
 * @param duration - Cache duration in milliseconds
 */
export const setCachedData = async <T>(
  key: string,
  data: T,
  duration: number
): Promise<void> => {
  try {
    const now = Date.now();
    const cachedData: CachedData<T> = {
      data,
      timestamp: now,
      expiresAt: now + duration,
    };

    await AsyncStorage.setItem(key, JSON.stringify(cachedData));
    console.log(`💾 Cached data for key: ${key} (expires in ${duration / 1000 / 60}min)`);
  } catch (error) {
    console.error(`❌ Error setting cache for key ${key}:`, error);
  }
};

/**
 * Remove a specific cache entry
 * @param key - Cache key to remove
 */
export const removeCachedData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`🗑️ Removed cache for key: ${key}`);
  } catch (error) {
    console.error(`❌ Error removing cache for key ${key}:`, error);
  }
};

/**
 * Clear all cache entries that match a prefix
 * @param prefix - Cache key prefix to match
 */
export const clearCacheByPrefix = async (prefix: string): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keysToRemove = keys.filter((key) => key.startsWith(prefix));
    
    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log(`🗑️ Cleared ${keysToRemove.length} cache entries with prefix: ${prefix}`);
    }
  } catch (error) {
    console.error(`❌ Error clearing cache with prefix ${prefix}:`, error);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('🗑️ Cleared all cache');
  } catch (error) {
    console.error('❌ Error clearing all cache:', error);
  }
};

/**
 * Get cache statistics
 * @returns Object with cache info
 */
export const getCacheStats = async (): Promise<{
  totalKeys: number;
  totalSize: number;
  keys: readonly string[];
}> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    console.log(`📊 Cache stats: ${keys.length} keys, ${(totalSize / 1024).toFixed(2)} KB`);
    
    return {
      totalKeys: keys.length,
      totalSize,
      keys,
    };
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    return {
      totalKeys: 0,
      totalSize: 0,
      keys: [],
    };
  }
};

/**
 * Wrapper function for API calls with caching
 * Checks cache first, calls API if needed, then caches the result
 * @param cacheKey - Key to use for caching
 * @param apiCall - Function that makes the API call
 * @param cacheDuration - How long to cache the data
 * @param forceRefresh - Skip cache and fetch fresh data
 */
export const fetchWithCache = async <T>(
  cacheKey: string,
  apiCall: () => Promise<T>,
  cacheDuration: number,
  forceRefresh: boolean = false
): Promise<T> => {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // Cache miss or force refresh - call API
  console.log(`🌐 Fetching fresh data for: ${cacheKey}`);
  const freshData = await apiCall();

  // Cache the fresh data
  await setCachedData(cacheKey, freshData, cacheDuration);

  return freshData;
};
