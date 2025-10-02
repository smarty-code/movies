import { icons } from "constants/icons";
import { images } from "constants/images";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getSavedMovies, unsaveMovie } from "services/appwrite";

const Save = () => {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load saved movies
  const loadSavedMovies = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const movies = await getSavedMovies(showRefreshing);
      setSavedMovies(movies);
      console.log(`💾 Loaded ${movies.length} saved movies`);
    } catch (error) {
      console.error('Error loading saved movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedMovies(false);
    }, [])
  );

  // Handle pull to refresh
  const handleRefresh = () => {
    loadSavedMovies(true);
  };

  // Handle remove movie
  const handleRemoveMovie = (movie: SavedMovie) => {
    Alert.alert(
      'Remove from Watchlist',
      `Remove "${movie.title}" from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await unsaveMovie(movie.movie_id);
              setSavedMovies(prev => prev.filter(m => m.movie_id !== movie.movie_id));
              console.log(`🗑️ Removed ${movie.title} from watchlist`);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove movie. Please try again.');
              console.error('Error removing movie:', error);
            }
          },
        },
      ]
    );
  };

  // Render movie card
  const renderMovieCard = ({ item }: { item: SavedMovie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => router.push(`/movie/${item.movie_id}`)}
    >
      <Image
        source={{ uri: item.poster_url || 'https://placehold.co/600x400/1a1a1a/FFFFFF.png' }}
        style={styles.posterImage}
        resizeMode="cover"
      />
      
      {/* Remove button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMovie(item)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.vote_average > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>
              {(item.vote_average / 2).toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔖</Text>
      <Text style={styles.emptyTitle}>No movies saved yet</Text>
      <Text style={styles.emptyDescription}>
        Start building your watchlist by saving movies you want to watch
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.browseButtonText}>Browse Movies</Text>
      </TouchableOpacity>
    </View>
  );

  // Render header
  const renderHeader = () => (
    <>
      <View style={styles.logoContainer}>
        <Image source={icons.logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Watchlist</Text>
        <Text style={styles.headerSubtitle}>
          {savedMovies.length} {savedMovies.length === 1 ? 'movie' : 'movies'} saved
        </Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={images.bg} style={styles.backgroundImage} resizeMode="cover" />
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text style={styles.loadingText}>Loading your watchlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.bg} style={styles.backgroundImage} resizeMode="cover" />
      
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={savedMovies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.movie_id.toString()}
        numColumns={3}
        columnWrapperStyle={savedMovies.length > 0 ? styles.gridRow : undefined}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0E27',
    flex: 1,
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
    marginTop: 24,
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 56,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  movieCard: {
    width: '30%',
    position: 'relative',
    marginBottom: 4,
  },
  posterImage: {
    width: '100%',
    aspectRatio: 2/3,
    borderRadius: 16,
    backgroundColor: 'rgba(138, 143, 168, 0.2)',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(248, 113, 113, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  movieInfo: {
    marginTop: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFB800',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#AB8BFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Save;