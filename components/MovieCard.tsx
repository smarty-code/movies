import { icons } from "constants/icons";
import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View, StyleSheet } from "react-native";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  // WatchMode provides full CDN URLs, TMDB provides path only
  const getPosterUrl = () => {
    if (!poster_path) {
      return "https://placehold.co/600x400/1a1a1a/FFFFFF.png";
    }
    
    // If it's already a full URL (WatchMode), use it directly
    if (poster_path.startsWith('http')) {
      return poster_path;
    }
    
    // If it's a path (TMDB), construct the URL
    return `https://image.tmdb.org/t/p/w500${poster_path}`;
  };

  const rating = vote_average ? (vote_average / 2).toFixed(1) : '0.0';

  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <Image
          source={{ uri: getPosterUrl() }}
          style={styles.poster}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.starEmoji}>⭐</Text>
            <Text style={styles.ratingText}>
              {rating}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <Text style={styles.genre}>
            Action • Movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  infoContainer: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starEmoji: {
    color: '#FFB800',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  genre: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default MovieCard;