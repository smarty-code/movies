import MovieCard from "components/MovieCard";
import SearchBar from "components/SearchBar";
import { icons } from "constants/icons";
import { images } from "constants/images";
import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet } from "react-native";
import { fetchMovies } from "services/api";
import { updateSearchCount } from "services/appwrite";
import useFetch from "services/usefetch";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();

        // Call updateSearchCount only if there are results
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <Image
        source={images.bg}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <FlatList
        style={styles.list}
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.logoContainer}>
              <Image source={icons.logo} style={styles.logo} />
            </View>

            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                style={styles.loader}
              />
            )}

            {error && (
              <Text style={styles.errorText}>
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text style={styles.resultsText}>
                  Search Results for{" "}
                  <Text style={styles.queryText}>{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
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
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  list: {
    paddingHorizontal: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 40,
  },
  searchContainer: {
    marginVertical: 20,
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: '#EF4444',
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  resultsText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  queryText: {
    color: '#AB8BFF',
  },
  emptyContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
  },
});

export default Search;