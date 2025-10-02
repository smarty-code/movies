import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { images } from 'constants/images';
import { icons } from 'constants/icons';
import useFetch from 'services/usefetch';
import { fetchMoviesCached } from 'services/cachedApi';
import SearchBar from 'components/SearchBar';
import { getTrendingMovies } from 'services/appwrite';
import TrendingCard from 'components/TrendingCard';
import MovieCard from 'components/MovieCard';
import { useCallback, useRef, useState } from 'react';

const Index = () => {
  const router = useRouter();
  const isFirstFocus = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMoviesCached('', 1));

  // Initialize movies when data loads
  useCallback(() => {
    if (movies && movies.length > 0 && allMovies.length === 0) {
      setAllMovies(movies);
    }
  }, [movies]);

  // Set initial movies
  if (movies && allMovies.length === 0 && !moviesLoading) {
    setAllMovies(movies);
  }

  // Load more movies (pagination)
  const loadMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    console.log(`📄 Loading page ${currentPage + 1}...`);

    try {
      const nextPage = currentPage + 1;
      const newMovies = await fetchMoviesCached('', nextPage);
      
      if (newMovies && newMovies.length > 0) {
        setAllMovies(prev => [...prev, ...newMovies]);
        setCurrentPage(nextPage);
        console.log(`✅ Loaded ${newMovies.length} more movies (page ${nextPage})`);
      } else {
        setHasMore(false);
        console.log('📭 No more movies to load');
      }
    } catch (error) {
      console.error('❌ Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Refresh trending movies when the screen comes into focus (but not on initial load)
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      
      console.log('🔄 Home screen focused - refreshing trending movies...');
      refetchTrending();
    }, [])
  );

  // Render footer for loading indicator
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#AB8BFF" />
        <Text style={styles.footerText}>Loading more movies...</Text>
      </View>
    );
  };

  // Render header with trending movies
  const renderHeader = () => (
    <>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={icons.logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar onPress={() => router.push("/search")} placeholder="Search through 300+ movies online" />
      </View>

      {moviesLoading || trendingLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : moviesError || trendingError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error loading movies</Text>
          <Text style={styles.errorMessage}>
            {moviesError?.message || trendingError?.message}
          </Text>
          <Text style={styles.errorHint}>Please check your API key in the .env file</Text>
        </View>
      ) : (
        <>
          {/* Popular Movies Section */}
          {trendingMovies && trendingMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular movies</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={trendingMovies}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={{ ...item }} index={index} />
                )}
                keyExtractor={(item) => item.movie_id.toString()}
                ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
              />
            </View>
          )}

          {/* Latest Movies Section Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest movies</Text>
          </View>
        </>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <Image source={images.bg} style={styles.backgroundImage} resizeMode="cover" />

      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={allMovies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !moviesLoading && !trendingLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No movies found</Text>
            </View>
          ) : null
        }
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 56,
  },
  searchContainer: {
    marginBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  errorTitle: {
    color: '#F87171',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  errorHint: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
  section: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  horizontalList: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  cardSeparator: {
    width: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  footerLoader: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});

export default Index;
