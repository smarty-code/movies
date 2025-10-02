# WatchMode API Setup Guide

## ✅ Changes Made

### 1. **API Service Updated** (`services/api.ts`)
- ✅ Replaced TMDB API with WatchMode API
- ✅ Proper response mapping to existing Movie interface
- ✅ Fetches detailed movie info including posters
- ✅ Handles both search and browse modes

### 2. **Components Updated**

#### **MovieCard.tsx**
- ✅ Handles both WatchMode full CDN URLs and TMDB paths
- ✅ Better fallback for missing posters
- ✅ Safe handling of missing vote_average and dates

#### **Index.tsx**
- ✅ Improved loading states with better UI
- ✅ Better error messages
- ✅ Empty state handling
- ✅ Conditional rendering for empty data

## 🔑 Setup Instructions

### 1. Get WatchMode API Key
1. Visit: https://api.watchmode.com/requestApiKey/
2. Fill in your details (it's free!)
3. Copy your API key

### 2. Configure Environment
Create or update `.env` file in project root:

```env
EXPO_PUBLIC_WATCHMODE_API_KEY=your_api_key_here
```

### 3. Restart Development Server
```bash
npm start -c
# or
npx expo start --clear
```

## 📊 API Endpoints Used

### Browse Movies
```
GET /v1/list-titles/
Parameters:
  - types=movie
  - sort_by=popularity_desc
  - limit=50
```

### Search Movies
```
GET /v1/autocomplete-search/
Parameters:
  - search_value=query
  - search_type=3 (movies only)
```

### Movie Details
```
GET /v1/title/{id}/details/
```

## 🎨 Features

### ✅ Working Features
- ✅ Browse popular movies
- ✅ Search movies by title
- ✅ View movie details
- ✅ Movie posters from WatchMode CDN
- ✅ Ratings and release dates
- ✅ No region restrictions

### 📝 Data Mapping
WatchMode → Your App:
- `id` → `id`
- `title` → `title`
- `poster` (full URL) → `poster_path`
- `backdrop` (full URL) → `backdrop_path`
- `user_rating` → `vote_average`
- `plot_overview` → `overview`
- `release_date` → `release_date`

## 🔧 Troubleshooting

### Movies not loading?
1. Check `.env` file has correct API key
2. Restart expo server: `npm start -c`
3. Check terminal for error messages
4. Verify API key at: https://api.watchmode.com/

### Images not showing?
- WatchMode provides full CDN URLs
- Check poster_path in API response
- MovieCard component handles both formats

### Rate Limiting?
- Free tier: Check your plan limits
- Cache responses to minimize API calls
- Consider implementing pagination

## 🌐 API Response Examples

### List Titles Response
```json
{
  "titles": [
    {
      "id": 3173903,
      "title": "Breaking Bad",
      "year": 2008,
      "type": "tv_series"
    }
  ]
}
```

### Title Details Response
```json
{
  "id": 3173903,
  "title": "Breaking Bad",
  "poster": "https://cdn.watchmode.com/posters/...",
  "backdrop": "https://cdn.watchmode.com/backdrops/...",
  "user_rating": 9.2,
  "plot_overview": "Description...",
  "genres": [7],
  "genre_names": ["Drama"]
}
```

## 💡 Tips

1. **Performance**: API fetches details for first 20 movies
2. **Caching**: Consider implementing cache for better UX
3. **Pagination**: Add pagination for more movies
4. **Error Handling**: All errors are logged to console

## 📚 Resources
- [WatchMode API Docs](https://api.watchmode.com/docs/)
- [Request API Key](https://api.watchmode.com/requestApiKey/)
- [Supported Regions](https://api.watchmode.com/docs/#regions)
