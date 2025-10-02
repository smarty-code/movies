import { images } from "constants/images";
import { Link } from "expo-router";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  const getPosterUrl = () => {
    if (!poster_url) {
      console.log(`⚠️ No poster_url for movie: ${title}`);
      return "https://placehold.co/600x400/1a1a1a/FFFFFF.png";
    }

    // If it's already a full URL (WatchMode or TMDB from Appwrite), use it directly
    if (poster_url.startsWith('http')) {
      return poster_url;
    }

    // If it's a path (legacy TMDB), construct the URL
    console.log(`⚠️ Poster is a path, constructing URL for: ${title}`);
    return `https://image.tmdb.org/t/p/w500${poster_url}`;
  };
  
  console.log(`📽️ TrendingCard - Movie: ${title}, Poster URL: ${poster_url}`);

  return (
    <Link href={`/movie/${movie_id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <Image
          source={{ uri: getPosterUrl() }}
          style={styles.poster}
          resizeMode="cover"
          onError={(error) => {
            console.error(`❌ Failed to load image for ${title}:`, error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log(`✅ Successfully loaded image for ${title}`);
          }}
        />

        {/* Ranking Badge */}
        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full" style={styles.badgeContainer}>
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl" style={styles.rankingNumber}>
                {index + 1}
              </Text>
            }
          >
            <Image
              source={images.rankingGradient}
              style={styles.gradientImage}
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        {/* Title and Genre */}
        <View style={styles.infoContainer}>
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
    width: 144,
    position: 'relative',
  },
  poster: {
    width: 144,
    height: 208,
    borderRadius: 16,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 40,
    left: -5,
    zIndex: 10,
    
    
  },
  rankingNumber: {
    fontSize: 50,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gradientImage: {
    width: 72,
    height: 72,
  },
  infoContainer: {
    marginTop: 24,
    paddingLeft: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  genre: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default TrendingCard;