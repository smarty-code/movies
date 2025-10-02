export const WATCHMODE_CONFIG = {
  BASE_URL: "https://api.watchmode.com/v1",
  API_KEY: process.env.EXPO_PUBLIC_WATCHMODE_API_KEY || "YOUR_API_KEY_HERE",
};

// WatchMode Movie interface
interface WatchModeTitle {
  id: number;
  title: string;
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: string;
  type: string;
}

interface WatchModeSearchResult {
  title_results: {
    id: number;
    name: string;
    type: string;
    year: number;
    imdb_id: string;
    tmdb_id: number;
    tmdb_type: string;
  }[];
}

interface WatchModeDetailsResponse {
  id: number;
  title: string;
  original_title: string;
  plot_overview: string;
  type: string;
  runtime_minutes: number;
  year: number;
  release_date: string;
  imdb_id: string;
  tmdb_id: number;
  poster: string;
  backdrop: string;
  user_rating: number;
  critic_score: number;
  genres: number[];
  genre_names: string[];
}

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  try {
    let endpoint: string;
    
    if (query && query.trim() !== "") {
      // Use autocomplete search for better results
      endpoint = `${WATCHMODE_CONFIG.BASE_URL}/autocomplete-search/?apiKey=${WATCHMODE_CONFIG.API_KEY}&search_value=${encodeURIComponent(query)}&search_type=3`;
    } else {
      // List popular movies
      endpoint = `${WATCHMODE_CONFIG.BASE_URL}/list-titles/?apiKey=${WATCHMODE_CONFIG.API_KEY}&types=movie&sort_by=popularity_desc&limit=50`;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform WatchMode response to match Movie interface
    if (query && query.trim() !== "") {
      // Autocomplete response format
      const results = data.results || [];
      return results.map((item: any) => ({
        id: item.id || 0,
        title: item.name || 'Unknown',
        adult: false,
        backdrop_path: item.image_url || null,
        genre_ids: [],
        original_language: 'en',
        original_title: item.name || '',
        overview: '',
        popularity: item.relevance || 0,
        poster_path: item.image_url || null,
        release_date: item.year?.toString() || '',
        video: false,
        vote_average: 0,
        vote_count: 0,
      }));
    } else {
      // List titles response format - need to fetch details for each
      const titles = data.titles || [];
      
      // Fetch details for first 20 movies to get poster images
      const detailedMovies = await Promise.all(
        titles.slice(0, 20).map(async (item: any) => {
          try {
            const detailsEndpoint = `${WATCHMODE_CONFIG.BASE_URL}/title/${item.id}/details/?apiKey=${WATCHMODE_CONFIG.API_KEY}`;
            const detailsResponse = await fetch(detailsEndpoint, {
              method: "GET",
              headers: { accept: "application/json" },
            });
            
            if (detailsResponse.ok) {
              const details = await detailsResponse.json();
              return {
                id: details.id || item.id,
                title: details.title || item.title || 'Unknown',
                adult: false,
                backdrop_path: details.backdrop || null,
                genre_ids: details.genres || [],
                original_language: details.original_language || 'en',
                original_title: details.original_title || details.title || '',
                overview: details.plot_overview || '',
                popularity: details.relevance_percentile || 0,
                poster_path: details.poster || null,
                release_date: details.release_date || item.year?.toString() || '',
                video: false,
                vote_average: details.user_rating || 0,
                vote_count: 0,
              };
            }
          } catch (error) {
            console.error(`Error fetching details for movie ${item.id}:`, error);
          }
          
          // Fallback if details fetch fails
          return {
            id: item.id || 0,
            title: item.title || 'Unknown',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            original_title: item.title || '',
            overview: '',
            popularity: 0,
            poster_path: null,
            release_date: item.year?.toString() || '',
            video: false,
            vote_average: 0,
            vote_count: 0,
          };
        })
      );
      
      return detailedMovies.filter(Boolean) as Movie[];
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const endpoint = `${WATCHMODE_CONFIG.BASE_URL}/title/${movieId}/details/?apiKey=${WATCHMODE_CONFIG.API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
    }

    const data: WatchModeDetailsResponse = await response.json();
    
    // Transform WatchMode response to MovieDetails interface
    return {
      id: data.id,
      title: data.title,
      overview: data.plot_overview || '',
      poster_path: data.poster || null,
      backdrop_path: data.backdrop || null,
      release_date: data.release_date || '',
      vote_average: data.user_rating || 0,
      runtime: data.runtime_minutes || 0,
      genres: data.genre_names?.map((name, index) => ({
        id: data.genres[index],
        name: name,
      })) || [],
    } as MovieDetails;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};