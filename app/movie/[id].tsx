import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchMovieDetailsCached } from "services/cachedApi";
import { updateMovieViewCount, getMovieViewCount } from "services/appwrite";
import useFetch from "services/usefetch";
import { icons } from "constants/icons";
import { useEffect, useState } from "react";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [viewCount, setViewCount] = useState<number>(0);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetailsCached(id as string)
  );

  // Update view count when movie loads and fetch current count
  useEffect(() => {
    if (movie) {
      // Update the view count in database
      updateMovieViewCount({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      } as Movie);

      // Fetch the updated view count
      getMovieViewCount(movie.id).then((count) => {
        setViewCount(count);
        console.log(`👁️ View count for "${movie.title}": ${count}`);
      });
    }
  }, [movie]);

  const getPosterUrl = () => {
    if (!movie?.poster_path) {
      return "https://placehold.co/600x400/1a1a1a/FFFFFF.png";
    }
    
    // If it's already a full URL (WatchMode), use it directly
    if (movie.poster_path.startsWith('http')) {
      return movie.poster_path;
    }
    
    // If it's a path (TMDB), construct the URL
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  };

  if (loading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#AB8BFF" />
      </SafeAreaView>
    );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: getPosterUrl() }}
            style={styles.posterImage}
            resizeMode="cover"
          />

          <TouchableOpacity style={styles.playButton}>
            <Image
              source={icons.play}
              style={styles.playIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie?.title}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {movie?.release_date?.split("-")[0] || 'N/A'} • 
            </Text>
            <Text style={styles.metaText}> PG-13</Text>
            <Text style={styles.metaText}> • {movie?.runtime || 0}m</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBox}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>
                {movie?.vote_average ? (movie.vote_average / 2).toFixed(1) : '0.0'}
              </Text>
              <Text style={styles.ratingMax}>/10 (200K)</Text>
            </View>
            <View style={styles.trendingBox}>
              <Text style={styles.trendingIcon}>�️</Text>
              <Text style={styles.trendingText}>{viewCount}</Text>
              <Text style={styles.viewLabel}> views</Text>
            </View>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          
          <View style={styles.releaseStatusRow}>
            <View style={styles.halfWidth}>
              <Text style={styles.infoLabel}>Release date</Text>
              <Text style={styles.infoValue}>
                {movie?.release_date 
                  ? new Date(movie.release_date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>Released</Text>
            </View>
          </View>

          <View style={styles.genresContainer}>
            <Text style={styles.infoLabel}>Generes</Text>
            <View style={styles.genresList}>
              {movie?.genres?.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              )) || <Text style={styles.infoValue}>N/A</Text>}
            </View>
          </View>

          <MovieInfo label="Countries" value="United States • Canada • UAE • Hungary • Italy • New Zealand" />

          <View style={styles.budgetRevenueRow}>
            <View style={styles.halfWidth}>
              <Text style={styles.infoLabel}>Budget</Text>
              <Text style={styles.infoValue}>$21.4 million</Text>
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.infoLabel}>Revenue</Text>
              <Text style={styles.infoValue}>$900 Million</Text>
            </View>
          </View>

          <MovieInfo label="Tagline" value="45.6 Billion Won is Child's Play" />

          <MovieInfo
            label="Production Companies"
            value={movie?.production_companies?.map((c) => c.name).join(" • ") || "Legendary Entertainment • Warner Bros. Entertainment • Villeneuve Films"}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.visitButton}
        onPress={() => {
          // Handle visit homepage action
          router.push("/")
        }}
      >
        <Text style={styles.visitButtonText}>Visit Homepage</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#0A0E27',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#0A0E27',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  posterContainer: {
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: 550,
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 24,
    height: 28,
    marginLeft: 4,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 143, 168, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ratingMax: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  trendingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 143, 168, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trendingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  trendingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
  releaseStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  halfWidth: {
    flex: 1,
  },
  genresContainer: {
    marginTop: 20,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  genreTag: {
    backgroundColor: 'rgba(138, 143, 168, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  budgetRevenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  visitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#AB8BFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Details;