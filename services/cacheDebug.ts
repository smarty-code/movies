/**
 * Cache Debug Utilities
 * Helper functions to inspect and manage cache during development
 */

import {
  getCacheStats,
  clearAllCache,
  clearCacheByPrefix,
  CACHE_KEYS,
  getCachedData,
} from './cacheService';

/**
 * Print detailed cache information to console
 */
export const debugCache = async () => {
  console.log('\n📊 ===== CACHE DEBUG INFO =====');
  
  const stats = await getCacheStats();
  
  console.log(`\n📦 Total Cached Items: ${stats.totalKeys}`);
  console.log(`💾 Total Cache Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
  
  console.log('\n🔑 Cached Keys:');
  stats.keys.forEach((key) => {
    console.log(`  - ${key}`);
  });
  
  console.log('\n===========================\n');
};

/**
 * Clear all movie-related caches
 */
export const clearMovieCache = async () => {
  console.log('🗑️ Clearing all movie caches...');
  await clearCacheByPrefix(CACHE_KEYS.MOVIES);
  await clearCacheByPrefix(CACHE_KEYS.MOVIE_DETAILS);
  await clearCacheByPrefix(CACHE_KEYS.SEARCH_RESULTS);
  console.log('✅ Movie caches cleared!');
};

/**
 * Clear trending cache
 */
export const clearTrendingCache = async () => {
  console.log('🗑️ Clearing trending cache...');
  await clearCacheByPrefix(CACHE_KEYS.TRENDING);
  console.log('✅ Trending cache cleared!');
};

/**
 * Inspect specific cache entry
 */
export const inspectCache = async (key: string) => {
  console.log(`\n🔍 Inspecting cache key: ${key}`);
  const data = await getCachedData(key);
  
  if (data) {
    console.log('✅ Cache entry found:');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('❌ Cache entry not found or expired');
  }
  console.log('');
};

/**
 * Reset entire cache (use with caution!)
 */
export const resetCache = async () => {
  console.log('⚠️ RESETTING ENTIRE CACHE...');
  await clearAllCache();
  console.log('✅ Cache reset complete!');
};

// Export for easy use in development
if (__DEV__) {
  // Make functions available globally for console debugging
  (global as any).cacheDebug = {
    info: debugCache,
    clear: resetCache,
    clearMovies: clearMovieCache,
    clearTrending: clearTrendingCache,
    inspect: inspectCache,
  };
  
  console.log('💡 Cache debug tools available:');
  console.log('  - cacheDebug.info()         : Show cache stats');
  console.log('  - cacheDebug.clear()        : Clear all cache');
  console.log('  - cacheDebug.clearMovies()  : Clear movie caches');
  console.log('  - cacheDebug.clearTrending(): Clear trending cache');
  console.log('  - cacheDebug.inspect(key)   : Inspect specific key');
}
