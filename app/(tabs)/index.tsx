import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { images } from 'constants/images';
import { icons } from 'constants/icons';
import useFetch from 'services/usefetch';
import { fetchMovies } from 'services/api';
import SearchBar from 'components/SearchBar';
import { getTrendingMovies } from 'services/appwrite';
import TrendingCard from 'components/TrendingCard';
import MovieCard from 'components/MovieCard';
import { useCallback, useRef } from 'react';

const Index = () => {
  const router = useRouter();
  const isFirstFocus = useRef(true);

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
  } = useFetch(() => fetchMovies({ query: '' }));

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

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <Image source={images.bg} style={styles.backgroundImage} resizeMode="cover" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={icons.logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Search Bar */}
        {/* <Link href="/search" style={styles.searchContainer}> */}
          <SearchBar onPress={() => router.push("/search")} placeholder="Search through 300+ movies online" />
        {/* </Link> */}

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
          <View style={styles.contentContainer}>
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

            {/* Latest Movies Section */}
            {movies && movies.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Latest movies</Text>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={styles.gridRow}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No movies found</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 16,
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
  contentContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 40,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});

export default Index;
